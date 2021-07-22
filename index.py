from flask import Flask
from config import BaseConfig
from flask_bcrypt import Bcrypt

app = Flask(__name__, static_folder="./static/dist", template_folder="./static")
app.config.from_object(BaseConfig)
app.secret_key = "aoij4w/ijsaI$2JASIJ1ijlasij"
bcrypt = Bcrypt(app)
