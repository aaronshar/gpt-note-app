from flask import Flask, request
import usersModel


app = Flask(__name__)


# verify note has required fields and then add to database
@app.route("/user/signup", methods=["POST"])
def add_note():
    required_fields = ["email", "password"]
    content = request.get_json()
    for field in required_fields:
        if field not in content:
            return ({"Error": "The request body is missing at least one of the required attributes"}, 400)

    response = usersModel.create_user(content)
    if not response:
        return ({"Error": "Unable to add user to database"}, 500)
    return (response, 201)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
