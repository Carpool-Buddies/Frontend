
# Set this to True only in dev environment. Highly verbose.
DEBUG = True

# Suppress idiot warning.
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Main database bind URI.
SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://ms_trace_dbu:bgu2010@127.0.0.1:3606/DifferentialInteractomes'

# Auxiliary bindings.
SQLALCHEMY_BINDS = {
    'InteractionsData': 'mysql+mysqldb://ms_agenet_dbu:bgu2010@127.0.0.1:3606/InteractionsData',
    'TissueExpressionData': 'mysql+mysqldb://ms_agenet_dbu:bgu2010@127.0.0.1:3606/TissueExpressionData',
    'Interactions': 'mysql+mysqldb://ms_agenet_dbu:bgu2010@127.0.0.1:3606/Interactions',
    'DifferentialInteractomes':'mysql+mysqldb://ms_agenet_dbu:bgu2010@127.0.0.1:3606/DifferentialInteractomes'
}
