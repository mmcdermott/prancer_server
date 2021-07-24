import json, os
dirname = os.path.dirname(__file__)

from flask_login import UserMixin

def dejson(fn: str):
    with open(fn, mode='r') as f:
        return json.load(f)

class StaticUser(UserMixin):
    USERS = dejson(os.path.join(dirname, 'users.json'))

    @classmethod
    def is_valid(cls, user_id: str, password: str):
        return user_id in cls.USERS and password == cls.USERS[user_id]

    def __init__(self, user_id):
        assert user_id in self.USERS
        self.id = user_id
