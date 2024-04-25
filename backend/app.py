from flask import Flask
from auth import blueprint as auth_blueprint

app = Flask(__name__)
app.register_blueprint(auth_blueprint, url_prefix='/auth')

# Example route
@app.route('/')
def index():
    return 'Test for Khalid'

if __name__ == '__main__':
    app.run(debug=True)
