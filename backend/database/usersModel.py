from firebase_admin import credentials, auth
import firebase_admin
import os
from dotenv import load_dotenv

load_dotenv()
# Use a service account - change when we deploy
FIREBASE_KEY = os.getenv('FIREBASE_KEY')
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_KEY)
    app = firebase_admin.initialize_app(cred)


# create a user with email and password on firestore
def create_user(info):
    email = info["email"]
    pw = info["password"]
    user = auth.create_user(
        email=email,
        password=pw,
    )
    return user.uid


# verify user with token
def verify_user(token):
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid
    except auth.InvalidIdTokenError:
        return None
    return None
