"""
* Spring 2024 project
* Author: @chaudhkh (https://github.com/Chaudhari988)
* Reference: 
https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
"""


from flask import Blueprint, redirect, url_for
from authlib.integrations.flask_client import OAuth

blueprint = Blueprint('auth', __name__)
oauth = OAuth()

# Configurations for OAuth provider are done here
# e.g., Google
oauth.register(
    'google',
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    access_token_url='', #%TODO
    access_token_method='POST',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid profile email'},
)

@blueprint.route('/login/google')
def google_login():
    redirect_uri = url_for('auth.authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@blueprint.route('/authorize')
def authorize():
    token = oauth.google.authorize_access_token()
    resp = oauth.google.get('userinfo')
    user_info = resp.json()
   
    return user_info
