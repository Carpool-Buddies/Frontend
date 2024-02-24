import os
import sys

from sqlalchemy import inspect
from sqlalchemy.exc import NoResultFound

from models import User

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies

from api.v1.database import db

sys.path.insert(0, '../..')

# initialize flask app
app = Flask(__name__)
api = Api(app)
CORS(app, supports_credentials=True)  # Allow credentials for CORS

# apply configuration
cfg = os.path.join(os.path.dirname(__file__), '../../config/dev.py')
app.config.from_pyfile(cfg)
jwt = JWTManager(app)

db.init_app(app)
# bind Model to existing tables
with app.app_context():
    # Reflect the database
    db.reflect()
    # Check if the User table exists
    if User.__tablename__ not in inspect(db.engine).get_table_names():
        # If the table does not exist, create it
        db.create_all()
        # Insert sample data
        if User.query.count() == 0:
            from api.v1 import sampleData

            sampleData.insert_sample_data(db)


@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Missing username or password'}), 400

    username = data['username']
    password = data['password']

    try:
        user = db.session.execute(db.select(User).filter_by(email=username, password=password)).scalar_one()
        if username == user.email and password == user.password:
            access_token = create_access_token(identity=username)
            return jsonify({'message': 'Login successful', 'access_token': access_token})
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except NoResultFound:
        return jsonify({'message': 'Invalid credentials'}), 401


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/protected", methods=['POST'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    response = jsonify(logged_in_as=current_user)

    return response, 200


# This is a good example for parsing address line arguments:
@app.route('/useArgs', methods=['GET'])
def use_args():
    from flask import request
    arg1 = request.args.get('arg1')
    arg2 = request.args.get('arg2')
    arg3 = request.args.get('arg3')
    arg4 = request.args.get('arg4')
    result = f'the args are {arg1}, {arg2}, {arg3}, {arg4}'
    return jsonify(result)


# This is another example for parsing address line arguments:
@app.route('/tissueResults/<arg1>/<arg2>/<arg3>/<arg4>/<arg5>/<arg6>', methods=['GET'])
def rank_processes(arg1, arg2, arg3, arg4, arg5, arg6):
    result = f'the args are {arg1}, {arg2}, {arg3}, {arg4}, {arg5}, {arg6}'
    return jsonify(result)
#
#
# @app.route("/postScoreMatrix", methods=['POST'])
# @use_kwargs(get_file_arg, location='view_args')
# # @cross_origin()
# def post_score_matrix():
#     from api.v1.service import create_result_file
#     user_file = request.json['uploadedFile']
#     session_id = request.json['sessionId']
#     time_stamp = request.json['timeStamp']
#     res = create_result_file(time_stamp, "ContextDependent", session_id, user_file)
#     return jsonify("success") if res else jsonify("error")


@app.errorhandler(422)
def handle_validation_error(err):
    # exc = err.data['exc']
    return err


@app.errorhandler(500)
def handle_internal_server_error(err):
    # exc = err.data['exc']
    # return jsonify({'errors': str(err), 'trace': traceback.format_exc()}), 500
    print('err:', err)
    return jsonify({'errors': 'The server has encountered an internal error, please check your query.'}), 500


@app.errorhandler(404)
def handle_page_not_found_error(err):
    # exc = err.data['exc']
    # return jsonify({'errors': repr(err)}), 404
    return jsonify({'errors': '404 - The path you are looking for is no on this server'}), 404


if __name__ == '__main__':
    basestring = (str, bytes)
    app.run(debug=True)
