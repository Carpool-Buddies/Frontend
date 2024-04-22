from datetime import datetime
import re

from utils.auth_exceptions import *

MAX_AGE = 16

class User:
    def __init__(self, _email, _password, _first_name, _last_name, _phone_number, _birthday):
        self.email = _email
        self.password = _password
        self.first_name = _first_name
        self.last_name = _last_name
        self.phone_number = _phone_number
        self.birthday = _birthday

    def validate(self):
        self.__validate_email()
        self.__validate_password()
        self.__validate_birthday()

    def __validate_password(self):
        """
        Validates a password to ensure it meets the following criteria:
        - Length of at least 8 characters
        - Contains at least one uppercase letter
        - Contains at least one lowercase letter
        - Contains at least one digit
        """
        # Combining all conditions into a single regular expression for efficiency
        regex = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$')
        if not regex.search(self.password):
            raise PasswordValidationError("Password must contain at least one symbol.")


    def __validate_email(self):
        """
        Validates the given email using a regex pattern.

        :param email: str, the email address to validate.
        :raises EmailValidationError: If the email does not match the pattern.
        """
        # Simple regex for validating an Email
        regex = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        if not re.match(regex, self.email, re.I):
            raise EmailValidationError("Invalid email format.")

    def __validate_birthday(self):
        """
        Validates the birthday to ensure it is in a correct format and the person is at least 16 years old.

        :raises InvalidBirthdayError: If the birthday does not match the expected format or if the person is under 16.
        """
        # Expected date format 'YYYY-MM-DD'
        format = "%Y-%m-%d"
        try:
            birthday = datetime.strptime(self.birthday, format)
            today = datetime.now()
            age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))

            if age < MAX_AGE:
                raise InvalidBirthdayError("Must be at least 16 years old.")
        except ValueError:
            raise InvalidBirthdayError("Invalid birthday date. Please use the YYYY-MM-DD format.")