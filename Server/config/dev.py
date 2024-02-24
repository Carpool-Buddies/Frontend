import secrets

# Set this to True only in dev environment. Highly verbose.
DEBUG = True

# Suppress idiot warning.
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Main database bind URI.
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:[password]@localhost:3306/CarpoolBGU'

JWT_SECRET_KEY = secrets.token_hex(32)
