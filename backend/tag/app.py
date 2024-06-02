

# Importing the libraries
from flask import Flask, request, jsonify, Blueprint
# import openai
from dotenv import load_dotenv
# import os
from tag.tag import generate_tags
from flask_cors import CORS
# from auth import init_oauth


load_dotenv()
tag_bp = Blueprint('tag_bp', __name__)
app = Flask(__name__)
CORS(tag_bp)
# google = init_oauth(app)

# app.register_blueprint(auth_bp, url_prefix='/auth')


@tag_bp.route('/api/generate-tags', methods=['POST'])
def tag_route():
    # print("JSON Data:", request.json)  # Parsed JSON data
    data = request.json
    # print("Data:", data['text'])
    if 'text' not in data:
        return "Error: No text provided for tagging.", 400
    return generate_tags(data['text'])


# this is for testing and debugging purpose only
@tag_bp.route('/test-json', methods=['POST'])
def test_json():
    # Print what's received to the console for debugging
    # print("Received JSON:", request.json)

    # Check if JSON data is present
    if not request.json:
        return jsonify({"error": "No JSON received"}), 400

    # Echo back the received JSON
    return jsonify({"received": request.json}), 200


@tag_bp.route('/')
def index():
    return "Welcome to the NotesGuru Tagging API!"


if __name__ == '__main__':
    app.run(debug=True, port=5000)
