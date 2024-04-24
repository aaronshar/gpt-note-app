from flask import Flask, request
import notesModel
import datetime
# TO-DO: think about how to incorporate authentication
# TO-DO: think through structure of URLs


app = Flask(__name__)

# verify note has required fields and then add to database
@app.route("/user/<user_id>/mynotes", methods=["POST"])
def add_note(user_id):
    required_fields = ["title", "content"]
    content = request.get_json()
    for field in required_fields:
        if field not in content:
            return ({"Error": "The request body is missing at least one of the required attributes"}, 400)

    # add date and user id to field
    content["date_created"] = datetime.datetime.now(tz=datetime.timezone.utc)
    content["user_id"] = user_id

    response = notesModel.post_note(content)
    if not response:
        return ({"Error": "Unable to add note to database"}, 500)
    # TO-DO: what do we want to return?
    return (response, 201)


# verify note exists and edit in database
@app.route("/user/<user_id>/mynotes/<note_id>", methods=["PUT"])
def edit_note(user_id, note_id):
    content = request.get_json()
    # TO-DO: should there be verification for authentication be here or only required when getting notes?
    response = notesModel.put_note(content, note_id)
    if not response:
        return ({"Error": "No note with this id exists"}, 404)
    # TO-DO: what do we want to return?
    return (response, 200)


# get all notes for current user
@app.route("/user/<user_id>/mynotes", methods=["GET"])
def get_all_notes(user_id):
    response = notesModel.get_all_notes(user_id)
    # TO-DO: what do we want to return?
    return (response, 200)


# get specific note for current user
@app.route("/user/<user_id>/mynotes/<note_id>", methods=["GET"])
def get_note(user_id, note_id):
    response = notesModel.get_note(note_id)
    if not response:
        return ({"Error": "No note with this id exists"}, 404)
    return (response, 200)


# delete specific note
@app.route("/user/<user_id>/mynotes/<note_id>", methods=["DELETE"])
def delete_note(user_id, note_id):
    response = notesModel.delete_note(note_id)
    if not response:
        return ({"Error": "No note with this id exists"}, 404)
    # TO-DO: do we need to delete anything else after deleting specific note?
    return ('', 204)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)