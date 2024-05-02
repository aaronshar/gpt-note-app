"""
* Spring 2024 project
* Author: @chaudhkh (https://github.com/Chaudhari988)
* Reference:
https://pythonhosted.org/Flask-OAuth/
https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
"""


from flask import Blueprint, redirect, url_for, session
from flask_oauth import OAuth
from flask import current_app as app
import os
from dotenv import load_dotenv


auth_bp = Blueprint('auth_bp', __name__)
oauth = OAuth(app)
# Load environment variables from .env file
load_dotenv()


google = oauth.register(
    name='google',
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv('CLIENT_SECRET'),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={
        'scope': 'openid email profile',
        'token_endpoint_auth_method': 'client_secret_post',
        'token_placement': 'header',
        'redirect_uri': 'http://localhost:5000/auth/authorize'
    }
)


@auth_bp.route('/login/google')
def google_login():
    google = oauth.create_client('google')
    redirect_uri = url_for('auth_bp.authorize', _external=True)
    return google.authorize_redirect(redirect_uri)


@auth_bp.route('/authorize')
def authorize():
    google = oauth.create_client('google')
    # token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    # User info to be stored here
    # session['email'] = user_info['email']
    # Redirect to home page after login success
    return redirect(url_for('home'))
