import firebase_admin
import os
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()
# Use a service account - change when deployed
FIREBASE_KEY = os.getenv('FIREBASE_KEY')
cred = credentials.Certificate(FIREBASE_KEY)
app = firebase_admin.initialize_app(cred)

db = firestore.client()


# adds note to the database
# returns a dictionary of created note
def post_note(note):
    update_time, note_ref = db.collection("notes").add(note)
    print(f"Added document with id {note_ref.id}")
    note_snapshot = note_ref.get()
    note = note_snapshot.to_dict()
    note["note_id"] = note_ref.id
    return note


# edit note data
# returns a dictionary object if the note exists
def put_note(note, note_id):
    note_ref = db.collection("notes").document(note_id)
    note_snapshot = note_ref.get()
    if not note_snapshot.exists:  # check if note exists
        return None
    note_ref.set(note)

    note_snapshot = note_ref.get()
    note = note_snapshot.to_dict()
    note["note_id"] = note_ref.id
    return note


# get all note data
# returns list with each document
def get_all_notes(user_id):
    note_ref = db.collection("notes")
    query_ref = note_ref.where("user_id", "==", user_id)
    docs = query_ref.stream()
    # create dictionary of all notes for user
    response = []
    for doc in docs:
        doc_dict = doc.to_dict()
        doc_dict["note_id"] = doc.id
        response.append(doc_dict)
    return response


# get specific note data
# returns iterator with each document
def get_note(note_id):
    note_ref = db.collection("notes").document(note_id)
    note_snapshot = note_ref.get()
    if not note_snapshot.exists:  # check if note exists
        return None
    note = note_snapshot.to_dict()
    note["note_id"] = note_ref.id
    return note


# delete a note
# return True if successfully delete, False if note doesn't exist
def delete_note(note_id):
    note_ref = db.collection("notes").document(note_id)
    note = note_ref.get()
    if not note.exists:  # check if note exists
        return False
    db.collection("notes").document(note_id).delete()
    return True
