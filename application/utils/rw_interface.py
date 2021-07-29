import io, json, os, pandas as pd

from google.cloud import storage, exceptions
from pathlib import Path

from .constants import BUCKET_NAME, STORAGE_DEST, LOCAL

class RWInterface():
    def __init__(self):
        pass

    def read(self, path: Path) -> str:
        raise NotImplementedError("Overwrite in base class!")
    def write(self, path: Path, blob_contents: str):
        raise NotImplementedError("Overwrite in base class!")

    def listdir(self, path: Path):
        raise NotImplementedError("Overwrite in base class!")

    def read_json(self, path: Path) -> dict:
        contents = self.read(path)
        return json.loads(contents)
    def write_json(self, path: Path, contents: dict):
        self.write(path, json.dumps(contents))

    def read_txt(self, path: Path) -> dict:
        return self.read(path)
    def write_txt(self, path: Path, contents: str):
        raise NotImplementedError("Not implemented yet.")

    def read_csv(self, path: Path) -> list:
        contents = self.read(path)
        return pd.read_csv(io.StringIO(contents))
    def write_csv(self, path: Path, contents: pd.DataFrame):
        raise NotImplementedError("Not implemented yet.")


class GoogleCloudBucketInterface(RWInterface):
    def __init__(self, bucket_name: str = BUCKET_NAME):
        super().__init__()

        self.bucket_name = bucket_name
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.get_bucket(self.bucket_name)

    def listdir(self, path: Path):
        """List all files in GCP bucket."""
        files = self.bucket.list_blobs(prefix=str(path))
        fileList = [f.name.replace(f"{str(path)}/", '') for f in files if '.' in f.name]
        return fileList

    def read(self, path: Path) -> str:
        try:
            blob = self.bucket.blob(str(path))
            return blob.download_as_text()
        except exceptions.NotFound as e:
            print(f"Got {e} on {path}")
            raise FileNotFoundError(e)

    def write(self, path: Path, blob_contents: str):
        blob = self.bucket.blob(str(path))
        blob.upload_from_string(blob_contents)

class LocalFileInterface(RWInterface):
    def listdir(self, path: Path):
        """List all files in GCP bucket."""
        return os.listdir(path)

    def read(self, path: Path) -> str:
        with open(path, mode='r') as f: return f.read()
    def write(self, path: Path, blob_contents: str):
        with open(path, mode='w') as f:
            f.write(blob_contents)

FileInterface = (LocalFileInterface if STORAGE_DEST == LOCAL else GoogleCloudBucketInterface)()
