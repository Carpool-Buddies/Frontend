from models.users import Users
from services.user import User

from utils.auth_exceptions import EmailValidationError, EmailAlreadyExistsError, InvalidBirthdayError

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

        except EmailValidationError:
            return {"success": False, "msg": "Invalid email format"}, 400

        except EmailAlreadyExistsError:
            return {"success": False, "msg": "Email already exists"}, 400

        except InvalidBirthdayError:
            return {"success": False, "msg": "Invalid birthday date"}, 400

        except Exception as e:
            return {"success": False, "msg": str(e)}, 500

