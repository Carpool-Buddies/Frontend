
# Set this to True only in dev environment. Highly verbose.
DEBUG = True

# Suppress idiot warning.
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Main database bind URI.

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:bgu2010972@netb22.bgu.ac.il:33306/TiPA'
# SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://username:password@localhost/DifferentialInteractomes'

# Auxiliary bindings.
SQLALCHEMY_BINDS = {
    'TiPA': 'mysql+pymysql://root:bgu2010972@netb22.bgu.ac.il:33306/TiPA',
    'Interactions': 'mysql+pymysql://ms_trace_dbu:bgu2010@netb22.bgu.ac.il:33306/Interactions'
}
