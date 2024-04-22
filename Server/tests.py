# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import pytest
import json

from api import app

"""
   Sample test data
"""

DUMMY_USERNAME = "apple"
DUMMY_EMAIL = "apple@apple.com"
DUMMY_PASS = "newpassword"

USER_REGISTRATION_SUCCESS_CODE = 200
BAD_REQUEST_CODE = 400
USER_REGISTRATION_SUCCESS_MESSAGE = "User registered successfully"
USER_REGISTRATION_INVALID_EMAIL_MESSAGE = "Invalid email format"

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@pytest.mark.parametrize("email, password, first_name, last_name, phone_number, birthday, expected_code, expected_msg", [
    # Test case 1: All fields are valid
    ("user1@example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01", USER_REGISTRATION_SUCCESS_CODE, USER_REGISTRATION_SUCCESS_MESSAGE),
    # Test case 2: Another valid scenario with different values
    ("user2@example.com", "AnotherValidPass2@", "Jane", "Smith", "0987654321", "1985-12-31", USER_REGISTRATION_SUCCESS_CODE, USER_REGISTRATION_SUCCESS_MESSAGE)
])
def test_GivenValidUserData_thenSignUp_returnSuccessCodeAndMsg(email, password, first_name, last_name, phone_number, birthday, expected_code, expected_msg, client):
    """
       Tests /users/register API
    """
    response = client.post(
        "api/auth/register",
        data=json.dumps(
            {
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
                "phone_number": phone_number,
                "birthday": birthday
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert data["msg"] == expected_msg
    assert response.status_code == expected_code


@pytest.mark.parametrize("email, password, first_name, last_name, phone_number, birthday", [
    # Missing '@' symbol
    ("user1example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # No domain
    ("user@.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # No username
    ("@example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"""),
    # Invalid character
    ("user*1@example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # Multiple '@' symbols
    ("user1@@example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # Leading whitespace
    (" user1@example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # Trailing whitespace
    ("user1@example.com ", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # No top-level domain
    ("user1@example", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
    # Contains spaces
    ("user 1@example.com", "ValidPassword1!", "John", "Doe", "1234567890", "1990-01-01"),
])
def test_GivenInvalidEmail_thenSignUp_returnAppropriateCodeAndMsg(email, password, first_name, last_name, phone_number, birthday, client):
    """
       Tests /api/auth/register API with various invalid email formats to ensure proper error handling.
    """
    response = client.post(
        "/api/auth/register",
        data=json.dumps(
            {
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
                "phone_number": phone_number,
                "birthday": birthday
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == BAD_REQUEST_CODE
    assert data["msg"] == USER_REGISTRATION_INVALID_EMAIL_MESSAGE



#
# def test_user_signup_invalid_data(client):
#     """
#        Tests /users/register API: invalid data like email field empty
#     """
#     response = client.post(
#         "api/users/register",
#         data=json.dumps(
#             {
#                 "username": DUMMY_USERNAME,
#                 "email": "",
#                 "password": DUMMY_PASS
#             }
#         ),
#         content_type="application/json")
#
#     data = json.loads(response.data.decode())
#     assert response.status_code == 400
#     assert "'' is too short" in data["msg"]
#
#
# def test_user_login_correct(client):
#     """
#        Tests /users/signup API: Correct credentials
#     """
#     response = client.post(
#         "api/users/login",
#         data=json.dumps(
#             {
#                 "email": DUMMY_EMAIL,
#                 "password": DUMMY_PASS
#             }
#         ),
#         content_type="application/json")
#
#     data = json.loads(response.data.decode())
#     assert response.status_code == 200
#     assert data["token"] != ""
#
#
# def test_user_login_error(client):
#     """
#        Tests /users/signup API: Wrong credentials
#     """
#     response = client.post(
#         "api/users/login",
#         data=json.dumps(
#             {
#                 "email": DUMMY_EMAIL,
#                 "password": DUMMY_EMAIL
#             }
#         ),
#         content_type="application/json")
#
#     data = json.loads(response.data.decode())
#     assert response.status_code == 400
#     assert "Wrong credentials." in data["msg"]
