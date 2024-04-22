from flask import request
from flask_restx import Resource, Namespace, fields

from datetime import datetime, timedelta, timezone

import jwt

from models import Users, JWTTokenBlocklist
from .config import BaseConfig

from services.auth_service import AuthService
from .token_decorators import token_required

auth = AuthService()

# Namespace for Auth
auth_ns = Namespace('auth', description='Authentication and user management')

"""
    Flask-Restx models for api request and response data
"""

signup_model = auth_ns.model('SignUpModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=6, max_length=32),
                                              "first_name": fields.String(required=True, min_length=1, max_length=32),
                                              "last_name": fields.String(required=True, min_length=1, max_length=32),
                                              "phone_number": fields.String(required=True, min_length=4, max_length=32),
                                              "birthday": fields.Date(required=True)
                                              })

login_model = auth_ns.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = auth_ns.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2, max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })

"""
    Flask-Restx routes
"""

@auth_ns.route('/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @auth_ns.expect(signup_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")
        _first_name = req_data.get("first_name")
        _last_name = req_data.get("last_name")
        _phone_number = req_data.get("phone_number")
        _birthday = req_data.get("birthday")

        return auth.register_user(_email, _password, _first_name, _last_name, _phone_number, _birthday)


@auth_ns.route('/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @auth_ns.expect(login_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 400

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 400

        # create access token uwing JWT
        token = jwt.encode({'email': _email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200


@auth_ns.route('/edit')
class EditUser(Resource):
    """
       Edits User's username or password or both using 'user_edit_model' input
    """

    @auth_ns.expect(user_edit_model)
    @token_required
    def post(self, current_user):

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            self.update_username(_new_username)

        if _new_email:
            self.update_email(_new_email)

        self.save()

        return {"success": True}, 200

@auth_ns.route('/logout')
class LogoutUser(Resource):
    """
       Logs out User using 'logout_model' input
    """

    @token_required
    def post(self, current_user):

        _jwt_token = request.headers["authorization"]

        jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
        jwt_block.save()

        self.set_jwt_auth_active(False)
        self.save()

        return {"success": True}, 200