import os
from flask import abort, request, render_template, jsonify, url_for, redirect, g
from flask_cors import CORS
from flask_login import login_required, LoginManager, login_user, logout_user, current_user
from wtforms import Form, TextField, PasswordField, validators

from index import app
from .user import StaticUser
from .utils.files import save_annotations_file, get_file_data, get_filenames_from_directory
from .utils.labels import get_umls_labels, get_labels_for_code, get_labels_for_keyword, get_colormap_data
from .utils.umls_retrieve import retrieve_cui_info
from .utils.tutorial import file_evaluation, clear_user_annotations, create_user_dir
from .utils.log import add_log

login_manager = LoginManager()
login_manager.init_app(app)

app.config.update(
    SESSION_COOKIE_SECURE   = True,
    SESSION_COOKIE_SAMESITE = 'None'
)

CORS(
    app,
    resources='/api/.*',
    origins=[os.environ.get('CLIENT_ORIGIN', 'http://localhost:3000')],
    supports_credentials=True,
)

@login_manager.user_loader
def load_user(user_id: str):
    user_id = user_id.lower()
    if user_id in StaticUser.USERS: return StaticUser(user_id)
    else: return None

class LoginForm(Form):
    email = TextField('E-mail', [validators.Required(), validators.Length(min=4, max=25)])
    password = PasswordField('Password', [validators.Required(), validators.Length(min=6, max=200)])

@app.route('/api/check_login', methods=['GET'])
def check_login():
    return jsonify(isLoggedIn = current_user.is_authenticated)

@app.route('/api/login', methods=['POST'])
def login():
    request_email = request.json['form']['email']
    request_password = request.json['form']['password']
    form = LoginForm(email=request_email, password=request_password)
    if request.method == 'POST' and form.validate():
        user_id, password = request_email, request_password

        if StaticUser.is_valid(user_id, password):
            login_user(load_user(user_id))
            return jsonify(success=True)
        else:
            return jsonify(success=False)
    else:
        return jsonify(success=False)

@app.route('/api/logout', methods=['POST'])# TODO: is POST right?
def logout():
    logout_user()
    return jsonify(success=True)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
@login_required
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/get_filenames", methods=["GET"])
@login_required
def get_filenames():
    filenames = get_filenames_from_directory()

    if filenames or filenames == []:
        return jsonify(filenames=filenames)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_file", methods=["POST"])  # this needs to be POST
@login_required
def get_file():
    incoming = request.get_json()
    id = incoming["id"]
    textDir = incoming["textDir"]
    annDir = incoming["annDir"]

    if textDir == None and annDir == None:
        file = get_file_data(id)
    else:
        file = get_file_data(id, textDir, annDir)

    if file:
        return jsonify(file=file)
    else:
        return jsonify(error=True), 403


@app.route("/api/save_annotations", methods=["POST"])
@login_required
def save_annotations():
    incoming = request.get_json()
    dir = incoming["dir"]

    if dir == None:
        is_saved = save_annotations_file(incoming["id"]+".json", incoming["annotations"])
    else:
        is_saved = save_annotations_file(incoming["id"]+".json", incoming["annotations"], dir)

    if is_saved:
        return jsonify(saved=True)
    else:
        return jsonify(saved=False), 403

@app.route("/api/search_labels", methods=["POST"])
@login_required
def search_labels():
    incoming = request.get_json()
    labels = get_labels_for_keyword(incoming["searchTerm"])

    if labels or labels == []:
        return jsonify(labels=labels)
    else:
        return jsonify(error=True), 403


@app.route("/api/recommend_labels", methods=["POST"])
@login_required
def recommend_labels():
    incoming = request.get_json()
    if incoming["isKeyword"]:
        labels = get_labels_for_keyword(incoming["searchTerm"])
    else:
        labels = get_labels_for_code(incoming["searchTerm"])

    if labels or labels == []:
        return jsonify(labels=labels)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_colormap", methods=["POST"])
@login_required
def get_colormap():
    incoming = request.get_json()
    colormap = get_colormap_data()

    if colormap:
        return jsonify(colormap=colormap)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_umls_info", methods=["POST"])
@login_required
def get_umls_info():
    incoming = request.get_json()
    umls_info = retrieve_cui_info(incoming["cui"])

    if umls_info or umls_info == []:
        return jsonify(umls_info=umls_info)
    else:
        return jsonify(error=True), 403


@app.route("/api/start_tutorial", methods=["POST"])
@login_required
def start_tutorial():
    incoming = request.get_json()
    user_id = incoming["userId"]
    start = create_user_dir(user_id)

    if user_id:
        return jsonify(start=start)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_tutorial_evaluation", methods=["POST"])
@login_required
def get_tutorial_evaluation():
    incoming = request.get_json()
    evaluation = file_evaluation(incoming["fileId"], incoming["userId"])

    if evaluation:
        return jsonify(evaluation=evaluation)
    else:
        return jsonify(error=True), 403


@app.route("/api/restart_tutorial", methods=["POST"])
@login_required
def restart_tutorial():
    incoming = request.get_json()
    restart = clear_user_annotations(incoming['userId'])
    return jsonify(restart=restart)


@app.route("/api/add_log_entry", methods=["POST"])
@login_required
def add_log_entry():
    incoming = request.get_json()
    id = incoming["id"]
    action = incoming["action"]
    annotation_id = incoming["annotation_id"]
    metadata = incoming["metadata"]
    return jsonify(log=add_log(id, action, annotation_id, metadata))
