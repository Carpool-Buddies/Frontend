
# Set this to True only in dev environment. Highly verbose.
DEBUG = False

# Suppress idiot warning.
SQLALCHEMY_TRACK_MODIFICATIONS = True

# Main database bind URI.
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:bgu2010972@netb22.bgu.ac.il:33306/diseasesProj'

# Auxiliary bindings.
SQLALCHEMY_BINDS = {
    # 'InteractionsData': 'mysql+pymysql://ms_trace_dbu:bgu2010@netb22.bgu.ac.il:33306/InteractionsData',
    # 'TissueExpressionData': 'mysql+pymysql://ms_trace_dbu:bgu2010@netb22.bgu.ac.il:33306/TissueExpressionData',
    # 'Interactions': 'mysql+pymysql://ms_trace_dbu:bgu2010@netb22.bgu.ac.il:33306/Interactions'
}
