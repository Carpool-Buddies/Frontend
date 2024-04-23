from datetime import datetime, timedelta

from flask import request, redirect, url_for
from flask_restx import Api, Resource

import jwt

from models import Users
from .auth_routes import auth_ns
from .driver_routes import driver_ns
from .config import BaseConfig
import requests
from urllib.parse import urlencode


rest_api = Api(version="1.0", title="Carpool Buddies API")

rest_api.add_namespace(auth_ns, path='/api/auth')
rest_api.add_namespace(driver_ns, path='/api/drivers')
# rest_api.add_namespace(pasenger_ns, path='/pasengers')



"""
    Flask-Restx routes
"""

"""
Copyright (c) 2019 - present AppSeed.us
"""
# TODO: maybe need to add user name

@rest_api.route('/api/sessions/oauth/github/')
class GitHubLogin(Resource):
    def get(self):
        code = request.args.get('code')
        client_id = BaseConfig.GITHUB_CLIENT_ID
        client_secret = BaseConfig.GITHUB_CLIENT_SECRET
        root_url = 'https://github.com/login/oauth/access_token'

        params = { 'client_id': client_id, 'client_secret': client_secret, 'code': code }

        data = requests.post(root_url, params=params, headers={
            'Content-Type': 'application/x-www-form-urlencoded',
        })

        response = data._content.decode('utf-8')
        access_token = response.split('&')[0].split('=')[1]

        user_data = requests.get('https://api.github.com/user', headers={
            "Authorization": "Bearer " + access_token
        }).json()
        
        user_exists = Users.get_by_username(user_data['login'])
        if user_exists:
            user = user_exists
        else:
            try:
                user = Users(username=user_data['login'], email=user_data['email'])
                user.save()
            except:
                user = Users(username=user_data['login'])
                user.save()
        
        user_json = user.toJSON()

        token = jwt.encode({"username": user_json['username'], 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)
        user.set_jwt_auth_active(True)
        user.save()

        return {"success": True,
                "user": {
                    "_id": user_json['_id'],
                    "email": user_json['email'],
                    "username": user_json['username'],
                    "token": token,
                }}, 200


@rest_api.route('/api/sessions/oauth/google')
class GoogleLogin(Resource):
    def get(self):
        # Step 1: User is redirected to Google's OAuth 2.0 server
        code = request.args.get('code')
        if not code:
            # Redirect user to Google's authorization page
            auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
            redirect_uri = url_for('GoogleLogin',
                                   _external=True)  # Ensure this matches the redirect URI in Google Developer Console
            params = {
                'client_id': BaseConfig.GOOGLE_CLIENT_ID,
                'redirect_uri': redirect_uri,
                'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
                'response_type': 'code',
                'access_type': 'offline',  # This requests a refresh token
            }
            return redirect(f"{auth_url}?{urlencode(params)}")

        # Step 2: Exchange authorization code for access token
        token_url = 'https://oauth2.googleapis.com/token'
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        body = {
            'code': code,
            'client_id': BaseConfig.GOOGLE_CLIENT_ID,
            'client_secret': BaseConfig.GOOGLE_CLIENT_SECRET,
            'redirect_uri': url_for('GoogleLogin', _external=True),
            'grant_type': 'authorization_code',
        }
        token_response = requests.post(token_url, headers=headers, data=body)
        token_response_data = token_response.json()
        access_token = token_response_data['access_token']

        # Step 3: Retrieve user information from Google's API
        userinfo_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
        userinfo_response = requests.get(userinfo_url, params={'alt': 'json', 'access_token': access_token})
        user_info = userinfo_response.json()

        # Step 4: Process the user information
        user_exists = Users.get_by_email(user_info['email'])
        if user_exists:
            user = user_exists
        else:
            try:
                user = Users(username=user_info['name'], email=user_info['email'])
                user.save()
            except Exception as e:
                return {"success": False, "message": str(e)}, 500

        # Generate JWT token
        token = jwt.encode({"username": user.username, 'exp': datetime.utcnow() + timedelta(minutes=30)},
                           BaseConfig.SECRET_KEY)
        user.set_jwt_auth_active(True)
        user.save()

        return {"success": True,
                "user": {
                    "email": user.email,
                    "username": user.username,
                    "token": token,
                }}, 200