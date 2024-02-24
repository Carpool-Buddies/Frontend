
# Set this to True only in dev environment. Highly verbose.
DEBUG = False

# Suppress idiot warning.
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Main database bind URI.
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:[password]@localhost:3306/CarpoolBGU'
