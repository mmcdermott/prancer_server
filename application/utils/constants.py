import os
from pathlib import Path

## LOCAL FILEPATHS ##

FILES_DIRECTORY = Path("data")                     # Annotation text files and saved annotations

LABELS_FILE = "./clinical-annotator-lookups/umls_lookup_snomed.pk"       # Map keyword -> UMLS code
INDEX_FILE = "./clinical-annotator-lookups/index_snomed.pk"              # Map UMLS code -> index
TYPES_FILE = "./clinical-annotator-lookups/type_tui_lookup.pk"           # Map types and tuis
COLORS_FILE = "./clinical-annotator-lookups/color_lookup.pk"             # Map type -> color
SUGGESTIONS_FILE = "./clinical-annotator-lookups/suggestions.pk"       # Map word -> CUI


LOG_DIRECTORY = "./log"                   # Logs of actions

SOURCES_FILE = './umls_sources.csv'            # List of UMLS defn sources

TUTORIAL_DIRECTORY = './tutorial'              # Tutorial files
USERS_DIRECTORY = './tutorial/users'           # Tutorial attempts by user ID
STORAGE_DIRECTORY = './tutorial/attempts'      # Tutorial attempts by timestamp


## FIXED CONSTANTS ##

TUTORIAL_LENGTH = 4                                  # Number of steps in the tutorial (also frontend)

UMLS_APIKEY = os.environ["UMLS_APIKEY"] # Key to make UMLS API calls
UMLS_URI = "https://uts-ws.nlm.nih.gov"              # URI to make UMLS API calls

# Options for pre-filled suggestions are "NONE", "CSV", and "MAP"
SUGGESTION_METHOD = os.environ.get("SUGGESTION_METHOD", "CSV")

# Storage Options
LOCAL = "LOCAL"
GOOGLE_CLOUD_BUCKET = "GOOGLE_CLOUD_BUCKET"
STORAGE_DEST = os.environ.get("STORAGE_DEST", LOCAL)
if STORAGE_DEST == GOOGLE_CLOUD_BUCKET:
    assert 'BUCKET_NAME' in os.environ
else: assert STORAGE_DEST == LOCAL

BUCKET_NAME = os.environ.get("BUCKET_NAME", '')
