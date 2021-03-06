import json, os
from pathlib import Path

from .constants import *
from .suggestions import suggest_mapped_annotations, load_csv_annotations
from .rw_interface import FileInterface

def get_filenames_from_directory():
    filenames = []
    print(
        f"Searching {FILES_DIRECTORY}, I see files {FileInterface.listdir(FILES_DIRECTORY)}"
    )
    for f in FileInterface.listdir(FILES_DIRECTORY):
        name, ext = os.path.splitext(f)
        if '.txt' in ext:
            filenames.append(name)
    return sorted(filenames)

def get_file_data(id, textDir: Path = FILES_DIRECTORY, annDir: Path = FILES_DIRECTORY, user=None):
    filepath = textDir / f"{id}.txt"
    csv_path =  textDir / f"{id}.csv"
    try:
        file_text = FileInterface.read_txt(filepath)
    except FileNotFoundError:
        print(filepath + " not found.")
        file_text = ""

    ann_filepath = annDir / f"{id}.json"
    user_ann_filepath = annDir / f"{id}_user:{user}.json"
    try: file_ann = FileInterface.read_json(user_ann_filepath)
    except FileNotFoundError:
        try: file_ann = FileInterface.read_json(ann_filepath)
        except FileNotFoundError:
            file_ann = []
            if SUGGESTION_METHOD == "MAP": file_ann = suggest_mapped_annotations(file_text)
            elif SUGGESTION_METHOD == "CSV":
                try:
                    anns = FileInterface.read_csv(csv_path)
                    file_ann = load_csv_annotations(file_text, anns)
                except FileNotFoundError:
                    print(csv_path + " not found.")

            save_annotations_file(id, file_ann, annDir, user=user)

    return {"text": file_text, "annotations": file_ann}


def save_annotations_file(filename, annotations, dir: Path = FILES_DIRECTORY, user=None):
    if user is None: filepath = dir / f"{filename}.json"
    else: filepath = dir / f"{filename}_user:{user}.json"

    try:
        FileInterface.write_json(filepath, annotations)
    except FileNotFoundError:
        print(filepath + " not found.")
        return None
    return filepath
