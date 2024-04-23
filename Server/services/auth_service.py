from api.config import BaseConfig
from models.users import Users
from services.user import User

from utils.auth_exceptions import *

from datetime import datetime, timedelta, timezone

import jwt

from models import Users, JWTTokenBlocklist


class AuthService:
    @staticmethod
    def register_user(email, password, first_name, last_name, phone_number, birthday):
        try:
            user = User(email, password, first_name, last_name, phone_number, birthday)
            user.validate()
            user = Users.register_user(user)
            return {"success": True,
                    "userID": user.id,
                    "msg": "User registered successfully"}, 200

        except EmailValidationError as eve:
            return {"success": False, "msg": "Invalid email format: " + str(eve)}, 400

        except EmailAlreadyExistsError:
            return {"success": False, "msg": "Email already exists!"}, 400

        except PasswordValidationError as pve:
            return {"success": False, "msg": "Invalid password format: " + str(pve)}, 400

        except InvalidBirthdayError:
            return {"success": False, "msg": "Invalid birthday date"}, 400

        except Exception as e:
            # TODO add e in debug
            return {"success": False, "msg": "Internal server error"}, 500

    @staticmethod
    def login(_email, _password):

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

    @staticmethod
    def logout(_jwt_token, current_user):

        jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
        jwt_block.save()

        current_user.set_jwt_auth_active(False)
        current_user.save()
        # TODO: maybe add try catch for un excepted errors
        return {"success": True}, 200

    @staticmethod
    def edit_user(self, current_user, _new_first_name, _new_last_name, _new_birthday):
        if _new_first_name:
            current_user.update_first_name(_new_first_name)

        if _new_last_name:
            current_user.update_last_name(_new_last_name)

        if _new_birthday:
            current_user.update_bithday(_new_birthday)

        current_user.save()

        return {"success": True}, 200

