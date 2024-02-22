import os
import sys, traceback
import csv
from datetime import datetime
from io import StringIO

from api.v1.paths import session_dir_path
sys.path.insert(0, '../..')

from flask import Flask, jsonify, Response, send_file, request
from flask_cors import CORS, cross_origin
from webargs.flaskparser import use_kwargs

# initialize flask app
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}}, headers="Content-Type")

# apply configuration
cfg = os.path.join(os.path.dirname(__file__), '../../config/dev.py')
app.config.from_pyfile(cfg)

# initialize error logging.
if not app.debug:
    import logging
    from logging.handlers import SMTPHandler
    from logging import Formatter

    mail_handler = SMTPHandler('smtp.bgu.ac.il',
                               'netbio@post.bgu.ac.il',
                               ['netbio@post.bgu.ac.il'], 'TRACE has failed')
    mail_handler.setLevel(logging.ERROR)

    mail_handler.setFormatter(Formatter('''
    Message type:       %(levelname)s
    Location:           %(pathname)s:%(lineno)d
    Module:             %(module)s
    Function:           %(funcName)s
    Time:               %(asctime)s

    Message:

    %(message)s
    '''))

# initialize db engine
from api.v1.database import db


db.init_app(app)
# bind Model to existing tables
db.reflect(app=app)
# Argument schemas
from webargs import fields, validate, ValidationError


def getWorkingVersion():
    from api.v1.models import Updates
    q = Updates.query.all()

    if q[0].Date > q[1].Date:
        return q[0].DBv
    else:
        return q[1].DBv


result = []


@app.route('/singleProcess', methods=['GET'])
# @cross_origin()
def sample():
    from api.v1.service import generate_single_process_data
    from flask import request
    process_name = request.args.get('process')
    mode = request.args.get('mode')
    session_id = request.args.get('sessionId')
    time_stamp = request.args.get('timeStamp')
    result = generate_single_process_data(process_name, mode, session_id, time_stamp)
    return jsonify(result)

@app.route('/singleProcessMSigDB', methods=['GET'])
# @cross_origin()
def singleProcessMSigDB():
    from api.v1.service import generate_single_process_data_MSigDB
    from flask import request
    process_name = request.args.get('process')
    mode = request.args.get('mode')
    session_id = request.args.get('sessionId')
    time_stamp = request.args.get('timeStamp')
    result = generate_single_process_data_MSigDB(process_name, mode if mode=="dependentData" else None, session_id, time_stamp)
    return jsonify(result)


@app.route('/processesByGenes', methods=['GET'])
# @cross_origin()
def get_processes_by_gene():
    from api.v1.service import generate_processes_by_gene
    from flask import request
    gene_hgnc = request.args.get('gene')
    result = generate_processes_by_gene(gene_hgnc)
    return jsonify(result)


@app.route('/processesByMultipleGenes', methods=['GET'])
# @cross_origin()
def get_processes_by_multiple_genes():
    from api.v1.service import generate_processes_by_genes
    from flask import request
    gene_list = request.args.get('genes').split(',')
    result = generate_processes_by_genes(gene_list)
    return jsonify(result)


@app.route('/multipleProcesses', methods=['GET'])
# @cross_origin()
def sample_processes():
    from api.v1.service import generate_multiple_process_data
    processes_names = request.args.get('processes')
    mode = request.args.get('mode')
    session_id = request.args.get('sessionId')
    time_stamp = request.args.get('timeStamp')
    result = generate_multiple_process_data(processes_names, mode, session_id, time_stamp)
    return jsonify(result)


@app.route('/multipleProcessesMSigDB', methods=['GET'])
# @cross_origin()
def multipleProcessesMSigDB():
    from api.v1.service import generate_multiple_process_MSigDB
    mode = request.args.get('mode')
    session_id = request.args.get('sessionId')
    time_stamp = request.args.get('timeStamp')
    result = generate_multiple_process_MSigDB(mode if mode=="dependentData" else None, session_id, time_stamp)
    return jsonify(result)


get_file_arg = {
    'filterUserExpData': fields
}


@app.route('/tissueResults/<tissue>/<threshold>/<checked>/<mode>/<session_id>/<time_stamp>', methods=['GET'])
# @cross_origin()
def rank_processes(tissue, threshold, checked, mode, session_id, time_stamp):
    from api.v1.service import genterate_rank_processes_data
    result = genterate_rank_processes_data(tissue, threshold, checked, mode, session_id, time_stamp)
    return jsonify(result)


@app.route('/tissueResultsMSigDB/<mode>/<tissue>/<session_id>/<time_stamp>', methods=['GET'])
# @cross_origin()
def rank_processesMSigDB(mode,tissue,session_id, time_stamp):
    from api.v1.service import genterate_rank_processes_data_MSigDB
    result = genterate_rank_processes_data_MSigDB(tissue, mode if mode=="dependentData" else None, session_id, time_stamp)
    return jsonify(result)


get_file_arg = {
    'filterUserExpData': fields
}

SESSION_DIR_PATH = session_dir_path()
# global uploded_file
# uploded_file =''

@app.route("/fileUpload", methods=['POST'])
@use_kwargs(get_file_arg, location='view_args')
# @cross_origin()
def get_file():
    from api.v1.service import extract_clusters_names
    global uploded_file
    uploded_file = request.json['filterUserExpData']['expData']
    result = extract_clusters_names(uploded_file)
    session_id = request.json['sessionId']
    time_stamp = request.json['timeStamp']
    try:
        user_dir = os.path.join(SESSION_DIR_PATH, session_id)
        result_file_path = os.path.join(user_dir, '{}_{}.csv'.format(time_stamp, "singleCell"))
        with open(result_file_path, 'a', newline='') as file:
            writer = csv.writer(file)
            for row in uploded_file.split('\n'):
                writer.writerow(row.split(','))
    except Exception as e:
        print("Failed to save file in data ",e)
    return jsonify(result)


@app.route("/saveUserFile", methods=['POST'])
@use_kwargs(get_file_arg, location='view_args')
# @cross_origin()
def save_file():
    from tissues_tipa_webtool import get_score
    user_file = request.json['filterUserExpData']['expData']
    ans = get_score(user_file)
    return jsonify(ans)


@app.route("/extractFeatures", methods=['POST'])
@use_kwargs(get_file_arg, location='view_args')
# @cross_origin()
def extract_features():
    from api.v1.service import extract_features_from_file
    user_file = request.json['uploadedFile']
    tissues_and_genes = extract_features_from_file(user_file)
    return jsonify(tissues_and_genes)


@app.route("/postScoreMatrix", methods=['POST'])
@use_kwargs(get_file_arg, location='view_args')
# @cross_origin()
def post_score_matrix():
    from api.v1.service import create_result_file
    user_file = request.json['uploadedFile']
    session_id = request.json['sessionId']
    time_stamp = request.json['timeStamp']
    res = create_result_file(time_stamp, "ContextDependent", session_id, user_file)
    return jsonify("success") if res else jsonify("error")


@app.route("/calulateMatrixFromFile", methods=['POST'])
@use_kwargs(get_file_arg, location='view_args')
# @cross_origin()
def calulate_matrix():
    from api.v1.tissues_tipa_webtool import get_score
    from api.v1.service import create_result_file
    user_file = request.json['uploadedFile']
    session_id = request.json['sessionId']
    time_stamp = request.json['timeStamp']
    result = get_score(user_file).to_json()
    create_result_file("", "scoreMatrix", session_id, result)
    return jsonify("success")


@app.route("/getDataPerCluster/<cluster>/<session_id>/<time_stamp>", methods=['POST'])
# @cross_origin()
def get_data(cluster, session_id, time_stamp, is_top_ten=True):
    from api.v1.single_cell_tipa_calc_for_webtool import get_ranks
    from api.v1.service import add_genes_gos
    from api.v1.service import create_result_cluster_file
    global uploded_file
    try:
        uploded_file = request.json['uploadedFile']['expData']
    except:
        print("no uploded_file, taking csv from storage")
        uploded_file = None
    try:
        if not uploded_file:
            csv_data = []
            user_dir = os.path.join(SESSION_DIR_PATH, session_id)
            file_path = os.path.join(user_dir, '{}_{}.csv'.format(time_stamp, "singleCell"))
            with open(file_path, 'r') as file:
                csv_data = list(csv.reader(file))
            uploded_file = '\n'.join([','.join(row) for row in csv_data])
        result = get_ranks(cluster, uploded_file, is_top_ten)
        result = add_genes_gos(result)
        create_result_cluster_file(time_stamp, "userExp", session_id, result, cluster)
    except Exception as e:
        print(e)
        result = "error"
    return jsonify(result)


@app.route("/getAllDataPerCluster/<cluster>/<session_id>/<time_stamp>", methods=['POST'])
# @cross_origin()
def get_full_data(cluster, session_id, time_stamp):
    return get_data(cluster, session_id, time_stamp, False)


@app.route("/getCellIdentityGroupsData", methods=['POST'])
# @cross_origin()
def get_cellData():
    from api.v1.single_cell_tipa_webtool_option import get_ranks
    from api.v1.service import create_result_file
    global uploded_file
    try:
        uploded_file = request.json['filterUserExpData']['expData']
    except:
        print("")
    time_stamp = request.json["timeStamp"]
    session_id = request.json["sessionId"]
    if (len(uploded_file) != 0):
        result = get_ranks(uploded_file)
        json_result = jsonify(result)
        create_result_file(time_stamp, "cellType", session_id, result)
        return json_result
    else:
        return jsonify("error")


@app.route("/postSession/<userID>", methods=['POST'])
# @cross_origin()
def post_session(userID):
    try:
        if 'ip' in request.get_json() and request.get_json()['ip'] is not None:
            save_location(request.get_json()['ip'])
        else:
            print('no ip found, using request ip')
            save_location(request.remote_addr)
    except Exception as e:
        print(e)
    from api.v1.service import create_session_dir
    time = datetime.now().replace(microsecond=0)
    time_str = str(time).replace(':', '_')
    user_name = userID.replace(' ', '_')
    res = create_session_dir(user_name)
    if res:
        return jsonify(time_str)
    else:
        return jsonify("error")


@app.route("/getSession/<session_id>/<timestamp>/<job_type>", methods=['POST'])
# @cross_origin()
def get_session(session_id, timestamp, job_type):
    from api.v1.service import get_session_results
    res = get_session_results(session_id, timestamp, job_type)
    return jsonify(res)


@app.route("/getSessionCluster/<session_id>/<timestamp>/<job_type>/<cluster>", methods=['POST'])
# @cross_origin()
def get_session_cluster(session_id, timestamp, job_type, cluster):
    from api.v1.service import get_session_cluster_results
    res = get_session_cluster_results(session_id, timestamp, job_type, cluster)
    return jsonify(res)


@app.route('/getExampleFile', methods=['GET'])
# @cross_origin()
def get_example_file():
    from api.v1.paths import files_path
    try:
        CSV_PATH = files_path() + 'SingleCell_Example_Input.csv'
        return send_file(CSV_PATH,
                         mimetype='text/csv',
                         attachment_filename='SingleCell_Example_Input.csv',
                         as_attachment=True)
    except Exception as e:
        csv = '1' + str(e)
        return Response(
            csv,
            mimetype="text/tsv",
            headers={"Content-disposition":
                         "attachment; filename=SingleCell_Example_Input.csv"})


@app.route('/getExampleFileDifferentialGeneExpression', methods=['GET'])
# @cross_origin()
def get_example_file_Differential_Gene_Expression():
    from api.v1.paths import files_download_path
    try:
        CSV_PATH = files_download_path() + 'Differential_V8_partail_db.csv'
        return send_file(CSV_PATH,
                         mimetype='text/csv',
                         attachment_filename='InputExample.csv',
                         as_attachment=True)
    except Exception as e:
        csv = '1' + str(e)
        return Response(
            csv,
            mimetype="text/tsv",
            headers={"Content-disposition":
                         "attachment; filename=InputExample.csv"})


@app.route('/getProActScoresFile', methods=['GET'])
# @cross_origin()
def get_ProAct_scores():
    from api.v1.paths import files_download_path
    try:
        CSV_PATH = files_download_path() + 'ProAct_scores_in_tissues.csv'
        return send_file(CSV_PATH,
                         mimetype='text/csv',
                         attachment_filename='ProAct_scores_in_tissues.csv',
                         as_attachment=True)
    except Exception as e:
        csv = '1' + str(e)
        return Response(
            csv,
            mimetype="text/tsv",
            headers={"Content-disposition":
                         "attachment; filename=ProAct_scores_in_tissues.csv"})


@app.route('/getProcessesAndAssociatedFile', methods=['GET'])
# @cross_origin()
def get_processes_and_associated():
    from api.v1.paths import files_download_path
    try:
        CSV_PATH = files_download_path() + 'processes_and_associated_cell_types.csv'
        return send_file(CSV_PATH,
                         mimetype='text/csv',
                         attachment_filename='processes_and_associated_cell_types.csv',
                         as_attachment=True)
    except Exception as e:
        csv = '1' + str(e)
        return Response(
            csv,
            mimetype="text/tsv",
            headers={"Content-disposition":
                         "attachment; filename=processes_and_associated_cell_types.csv"})


@app.route('/getProcessesAndGenesFile', methods=['GET'])
def get_processes_and_genes():
    from api.v1.paths import files_download_path
    try:
        CSV_PATH = files_download_path() + 'processes_and_genes_ENS.csv'
        return send_file(CSV_PATH,
                         mimetype='text/csv',
                         attachment_filename='processes_and_genes_ENS.csv',
                         as_attachment=True)
    except Exception as e:
        csv = '1' + str(e)
        return Response(
            csv,
            mimetype="text/tsv",
            headers={"Content-disposition":
                         "attachment; filename=processes_and_genes_ENS.csv"})


@app.route('/getMsigdbGenesEnsFile', methods=['GET'])
def get_msigdb_genes_ens():
    from api.v1.paths import files_download_path
    try:
        CSV_PATH = files_download_path() + 'msigdb_genes_ens.csv'
        return send_file(CSV_PATH,
                         mimetype='text/csv',
                         attachment_filename='msigdb_genes_ens.csv',
                         as_attachment=True)
    except Exception as e:
        csv = '1' + str(e)
        return Response(
            csv,
            mimetype="text/tsv",
            headers={"Content-disposition":
                         "attachment; filename=processes_and_genes_ENS.csv"})


def save_location(ip):
    try:
        import ipinfo
        access_token = '38497bee5db942'
        handler = ipinfo.getHandler(access_token)
        res = handler.getDetails(ip)
        import datetime
        date_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        row = ['ProAct', date_time, res.latitude, res.longitude, res.country_name, res.city]
        import csv
        with open(r'/Server/users_locations.csv', 'a', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(row)
    except Exception as e:
        print('save_location has failed')
        print(e)


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
