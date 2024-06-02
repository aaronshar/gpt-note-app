from flask import Flask
from flask_cors import CORS

from database.notesController import database_bp
from notegen.notegen_server import notegen_bp
from tag.app import tag_bp

app = Flask(__name__)
# CORS(app, origins='*',
#      headers=['Content-Type', 'Authorization'],
#      expose_headers='Authorization')
CORS(app)

app.register_blueprint(database_bp)
app.register_blueprint(notegen_bp)
app.register_blueprint(tag_bp)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
