# PRAnCER

PRAnCER (Platform enabling Rapid Annotation for Clinical Entity Recognition) is a web platform that enables
the rapid annotation of medical terms within clinical notes. A user can highlight spans of text and quickly
map them to concepts in large vocabularies within a single, intuitive platform. Users can use the search and
recommendation features to find labels without ever needing to leave the interface. Further, the platform can
take in output from existing clinical concept extraction systems as pre-annotations, which users can accept or
modify in a single click. These features allow users to focus their time and energy on harder examples
instead.

app-template.yaml -> app.yaml for gcloud deployment. Set your proper `UMLS_API_KEY` prior to deployment.

This is just the backend server for prancer. See
[https://github.com/mmcdermott/prancer_client](prancer_client) for the frontend client.

## Usage
### Installation Instructions

You should install the PRAnCER server using _pip_ (**not** conda -- this is because many deployment settings,
including heroku and gcloud, work natively with pip requirements.txt files but not conda env.yml files).

First, if needed install `python3`. Then, create a virtual environment or an empty conda environment to avoid
package conflicts with system installations. Finally, run `pip install -r requirements.txt`.

### User Logins
This system gates access to underlying data files to a json file of user emails and passwords stored in
`application/users.json`. A sample template of this file is found in `./sample_users.json`. Login is not
particularly secure.  `application/users.json` should never be committed to the repository.

### Linking to UMLS Vocabulary
Use of the platform requires a UMLS license, as it requires several UMLS-derived files to surface
recommendations. Please email magrawal (at) mit (dot) edu to request these files, along with your API key so
we may confirm. You can sign up [here](https://uts.nlm.nih.gov/uts/signup-login). Surfacing additional
information in the UI also requires you enter your UMLS API key in application/utils/constants.py.

### Loading in and Exporting Data
To load in data, users directly place any clinical text as .txt files in either the `./data` folder or set the
`STORAGE_DEST` environment variable to `GOOGLE_CLOUD_BUCKET` then set the `BUCKET_NAME` environment variable
to your bucket name and ensure your system is authenticated through the google bucket api, and data will be
read in and stored to that google cloud bucket.

The output of annotation is .json file in the /data folder with the same file prefix as the .txt. To start
annotating a note from scratch, a user can just delete the corresponding .json file.

### Pre-filled Suggestions
Two options exist for pre-filled suggestions; users specify which they want to use in
application/utils/constants.py. The default is "MAP".

Option 1 for pre-filled suggestions is "MAP", if users want to preload annotations based on a dictionary of
high-precision text to CUI for their domain, e.g. {hypertension: "C0020538"}. A pre-created dictionary will be
provided alongside the UMLS files described above.

Option 2 for pre-filled suggestions is "CSV", if users want to load in pre-computed pre-annotations (e.g. from
their own algorithm, scispacy, cTAKES, MetaMap). Users simply place a CSV of spans and CUIs, with the same
prefix as the data .txt file, and our scripts will automatically incorporate those annotations. example.csv in
the /data file provides an example.

### Run the server
Open one terminal tab and navigate to the root `prancer_server` directory. Then, run

```
PYTHONPATH="$(pwd)/..:$(pwd):$PYTHONPATH" FLASK_APP=manage.py flask run
```
If all goes well, you should see `* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)` followed by a
few more lines in the terminal.

You can then run the [`prancer_client`](https://github.com/mmcdermott/prancer_client) locally as well to
interact with the server.


## Contact

If you have any questions, please email Monica Agrawal [magrawal@mit.edu]. Credit belongs to Ariel Levy for
the development of this platform.

Based on [React-Redux-Flask boilerplate.](https://github.com/dternyak/React-Redux-Flask)
