import notesModel
import datetime
from flask import Flask, request, jsonify
from usersModel import verify_user
from flask_cors import CORS
# TO-DO: think about how to incorporate authentication
# TO-DO: think through structure of URLs

MISSING_ATTRIBUTE_ERROR = {"Error": "The request body is missing at least one of the required attributes"}
USER_UNAUTHORIZED_ERROR = {"Error: User unauthorized"}
DOES_NOT_EXIST_ERROR = {"Error": "No note with this id exists"}

app = Flask(__name__)
CORS(app, origins='*',
     headers=['Content-Type', 'Authorization'],
     expose_headers='Authorization')


# takes a list of notes as an argument
# returns list of notes ordered in alphabetical (or reverse) order by title
def sort_notes_by_name(note, rev=False):
    result = note.sorted(key=lambda x: x["title"], reverse=rev)
    return result


# takes a list of notes as an argument
# returns list of notes ordered in order by date created (or reversed)
def sort_notes_by_date(note, rev=False):
    result = note.sorted(key=lambda x: x["date_created"], reverse=rev)
    return result


# takes a tag and a list of notes as an argument
# returns a list of notes that contain given tags
def filter_by_tag(tag, notes):
    def has_tag(note):
        return tag in note["tags"]

    return filter(has_tag, notes)


# verify note has required fields and then add to database
@app.route("/api/mynotes", methods=["POST"])
def add_note():
    # check if body contains required fields
    required_fields = ["title", "content", "tags"]
    content = request.get_json()
    for field in required_fields:
        if field not in content:
            return (MISSING_ATTRIBUTE_ERROR, 400)

    # get user_id to store
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    uid = verify_user(token)
    if not uid:
        return (USER_UNAUTHORIZED_ERROR, 401)

    # add date and user id to field
    content["last_modified"] = datetime.datetime.now(tz=datetime.timezone.utc)
    content["user_id"] = uid

    response = notesModel.post_note(content)
    if not response:
        return ({"Error": "Unable to add note to database"}, 500)

    return (response, 201)


# verify note exists and edit in database
@app.route("/api/mynotes/<note_id>", methods=["PUT"])
def edit_note(note_id):
    content = request.get_json()

    # verify if valid user
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    uid = verify_user(token)
    if not uid:
        return (USER_UNAUTHORIZED_ERROR, 401)

    # check if user id matches user user_id in note
    note = notesModel.get_note(note_id)
    if not note:
        return (DOES_NOT_EXIST_ERROR, 404)
    elif note.user_id != uid:
        return (USER_UNAUTHORIZED_ERROR, 401)

    content["last_modified"] = datetime.datetime.now(tz=datetime.timezone.utc)
    response = notesModel.put_note(content, note_id)
    return (response, 200)


# get all notes for current user
@app.route("/api/mynotes", methods=["GET"])
def get_all_notes():
    # verify if valid user
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    uid = verify_user(token)
    if not uid:
        return (USER_UNAUTHORIZED_ERROR, 401)

    # response = json.dumps(notesModel.get_all_notes(uid))
    response = notesModel.get_all_notes(uid)
    return (response, 200)


# get specific note for current user
@app.route("/api/mynotes/<note_id>", methods=["GET"])
def get_note(note_id):
    # verify if valid user
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    uid = verify_user(token)
    if not uid:
        return (USER_UNAUTHORIZED_ERROR, 401)

    response = notesModel.get_note(note_id)
    if not response:
        return (DOES_NOT_EXIST_ERROR, 404)
    elif response["user_id"] != uid:
        return (USER_UNAUTHORIZED_ERROR, 401)
    return (response, 200)


# delete specific note
@app.route("/api/mynotes/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    headers = request.headers
    bearer = headers.get('Authorization')
    if not bearer:
        return jsonify({"Error": "Authorization token is missing"}), 401
    token = bearer.split(' ')[1] if len(bearer.split(' ')) > 1 else None
    if not token:
        return jsonify({"Error": "Bearer token is invalid"}), 401
    uid = verify_user(token)
    if not uid:
        return jsonify({"Error": "User unauthorized"}), 401

    note = notesModel.get_note(note_id)
    if not note:
        return jsonify({"Error": "No note with this id exists"}), 404
    elif note['user_id'] != uid:
        return jsonify({"Error": "User unauthorized to access this note"}), 401

    notesModel.delete_note(note_id)
    return jsonify({"Success": "Note deleted successfully"}), 204


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
