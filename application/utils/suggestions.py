import re
import time
import pickle
from ast import literal_eval

from .labels import cui2index, label_data
from .constants import *


suggestions = pickle.load(open(SUGGESTIONS_FILE, 'rb'))

def load_csv_annotations(text, annotation_df):
    annotations = {}

    for i, row in annotation_df.iterrows():
        span = (int(row['start']), int(row['end']))
        cui = [row['cui']]
        if span not in annotations:
            annotations[span] = create_annotation(
                text[span[0]:span[1]], span, cui, confidence='high', assertion=row['assertion'],
                target=row['target']
            )
        else:
            annotations[span]['labels'].extend(create_labels([cui] if type(cui) is str else cui, 'high'))

    return list(annotations.values())

def suggest_mapped_annotations(text):
    annotations = []
    for keyword in suggestions:
        labels = suggestions[keyword]
        annotations += keyword_annotations(text, keyword, labels, 'high')
    return annotations


def keyword_annotations(text, keyword, labels, confidence):
    ## Default to separate word, case insensitive
    try:
        return [create_annotation(text, match.span(), labels, confidence)
            for match in re.finditer(
                r'(?:^|\W)' + keyword + r'(?:$|\W)',
                text,
                flags=re.IGNORECASE
            )
        ]
    except:
        return []


def create_annotation(text, span, labels, confidence, assertion, target: str = 'patient_now'):
    timestamp = time.time()  # Didn't round to ms to preserve uniqueness
    start, end = span
    if type(labels) is str:
        labels = [labels]
    annotation = {
        "annotationId": timestamp,
        "createdAt": timestamp,
        "text": text[start:end],
        "spans": [{"start": span[0], "end": span[1]}],
        "labels": create_labels(labels, confidence),
        "CUIMode": "normal",
        "experimentMode": 0,
        "creationType": "auto",
        "decision": "undecided",
        "assertion": assertion,
        "target": target,
    }

    return annotation

## Only creates a suggestion for a single code
def create_labels(codes, confidence):
    if len(codes) > 0 and codes[0] in cui2index:
        data = label_data(cui2index[codes[0]])
        return [{
            "labelId": data[0],
            "title": data[1],
            "categories": [{"title": c[0], "type": c[1]} for c in data[2]],
            "confidence": confidence
        }]
    else:
        return []
