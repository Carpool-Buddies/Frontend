import csv
import json
from functools import reduce
from io import StringIO
import os

import pandas as pd
from sqlalchemy import and_
import api.v1.pathways_genes_size_filtered
import api.v1.term2name
import api.v1.ens_hgnc_2022
from api.v1 import MSigDB_genes
from api.v1.models import Ens_to_hgnc
from api.v1.tipa_per_context_users_data import calculate_tipa

single_cell_tissues_dict = {
    'Adipose0': 'Adipose_Subcutaneous',
    'Adipose1': 'Adipose_Visceral_Omentum',
    'Artery0': 'Artery_Aorta',
    'Artery1': 'Artery_Coronary',
    'Artery2': 'Artery_Tibial',
    'Brain0': 'Brain0',
    'Brain1': 'Brain1',
    'Brain2': 'Brain2',
    'Breast-Mammary Tissue': 'Breast_Mammary_Tissue',
    'Colon-Sigmoid': 'Colon_Sigmoid',
    'Esophagus0': 'Esophagus_Gastroesophageal_Junction',
    'Esophagus1': 'Esophagus_Mucosa',
    'Esophagus2': 'Esophagus_Muscularis',
    'Heart0': 'Heart_Atrial_Appendage',
    'Heart1': 'Heart_Left_Ventricle',
    'Liver': 'Liver',
    'Lung': 'Lung',
    'Muscle - Skeletal': 'Muscle_Skeletal',
    'Nerve - Tibial': 'Nerve_Tibial',
    'Ovary': 'Ovary',
    'Pituitary': 'Pituitary',
    'Prostate': 'Prostate',
    'Skin0': 'Skin_Not_Sun_Exposed_Suprapubic',
    'Skin1': 'Skin_Sun_Exposed_Lowerleg',
    'Testis': 'Testis',
    'Thyroid': 'Thyroid',
    'Uterus': 'Uterus',
    'Vagina': 'Vagina',
    'Whole Blood': 'Whole_Blood'
}

gtex_cell_tissues_dict = {
    'Adipose0': 'Adipose_Subcutaneous',
    'Adipose1': 'Adipose_Visceral_Omentum',
    'Adrenal Gland': 'Adrenal_Gland',
    'Artery0': 'Artery_Aorta',
    'Artery1': 'Artery_Coronary',
    'Artery2': 'Artery_Tibial',
    'Brain0': 'Brain0',
    'Brain1': 'Brain1',
    'Brain2': 'Brain2',
    'Brain3': 'Brain3',
    'Brain4': 'Brain4',
    'Brain5': 'Brain5',
    'Breast-Mammary Tissue': 'Breast_Mammary_Tissue',
    'Colon-Sigmoid': 'Colon_Sigmoid',
    'Esophagus0': 'Esophagus_Gastroesophageal_Junction',
    'Esophagus1': 'Esophagus_Mucosa',
    'Esophagus2': 'Esophagus_Muscularis',
    'Heart0': 'Heart_Atrial_Appendage',
    'Heart1': 'Heart_Left_Ventricle',
    'Liver': 'Liver',
    'Lung': 'Lung',
    'Muscle - Skeletal': 'Muscle_Skeletal',
    'Minor Salivary Gland': 'Minor_Salivary_Gland',
    'Nerve - Tibial': 'Nerve_Tibial',
    'Ovary': 'Ovary',
    'Pituitary': 'Pituitary',
    'Prostate': 'Prostate',
    'Skin0': 'Skin_Not_Sun_Exposed_Suprapubic',
    'Skin1': 'Skin_Sun_Exposed_Lowerleg',
    'Testis': 'Testis',
    'Thyroid': 'Thyroid',
    'Uterus': 'Uterus',
    'Vagina': 'Vagina',
    'Whole Blood': 'Whole_Blood'
}

gtex_cell_tissues_dict = {
    'Adipose0': 'Adipose_Subcutaneous',
    'Adipose1': 'Adipose_Visceral_Omentum',
    'Adrenal Gland': 'Adrenal_Gland',
    'Artery0': 'Artery_Aorta',
    'Artery1': 'Artery_Coronary',
    'Artery2': 'Artery_Tibial',
    'Brain0': 'Brain0',
    'Brain1': 'Brain1',
    'Brain2': 'Brain2',
    'Brain3': 'Brain3',
    'Brain4': 'Brain4',
    'Brain5': 'Brain5',
    'Breast-Mammary Tissue': 'Breast_Mammary_Tissue',
    'Colon-Sigmoid': 'Colon_Sigmoid',
    'Esophagus0': 'Esophagus_Gastroesophageal_Junction',
    'Esophagus1': 'Esophagus_Mucosa',
    'Esophagus2': 'Esophagus_Muscularis',
    'Heart0': 'Heart_Atrial_Appendage',
    'Heart1': 'Heart_Left_Ventricle',
    'Liver': 'Liver',
    'Lung': 'Lung',
    'Muscle - Skeletal': 'Muscle_Skeletal',
    'Minor Salivary Gland': 'Minor_Salivary_Gland',
    'Nerve - Tibial': 'Nerve_Tibial',
    'Ovary': 'Ovary',
    'Pituitary': 'Pituitary',
    'Prostate': 'Prostate',
    'Skin0': 'Skin_Not_Sun_Exposed_Suprapubic',
    'Skin1': 'Skin_Sun_Exposed_Lowerleg',
    'Testis': 'Testis',
    'Thyroid': 'Thyroid',
    'Uterus': 'Uterus',
    'Vagina': 'Vagina',
    'Whole Blood': 'Whole_Blood'
}

dependentData_cell_tissues_dict = {
    'Adipose - Subcutaneous': 'Adipose_Subcutaneous',
    'Adipose - Visceral (Omentum)': 'Adipose_Visceral_Omentum',
    'Adrenal Gland': 'Adrenal_Gland',
    'Artery - Aorta': 'Artery_Aorta',
    'Artery - Coronary': 'Artery_Coronary',
    'Artery - Tibial': 'Artery_Tibial',
    'Brain0': 'Brain0',
    'Brain1': 'Brain1',
    'Brain2': 'Brain2',
    'Brain3': 'Brain3',
    'Brain4': 'Brain4',
    'Brain5': 'Brain5',
    'Breast-Mammary Tissue': 'Breast_Mammary_Tissue',
    'Colon-Sigmoid': 'Colon_Sigmoid',
    'Esophagus - Gastroesophageal Junction': 'Esophagus_Gastroesophageal_Junction',
    'Esophagus - Mucosa': 'Esophagus_Mucosa',
    'Esophagus - Muscularis': 'Esophagus_Muscularis',
    'Heart - Atrial Appendage': 'Heart_Atrial_Appendage',
    'Heart - Left Ventricle': 'Heart_Left_Ventricle',
    'Liver': 'Liver',
    'Lung': 'Lung',
    'Muscle - Skeletal': 'Muscle_Skeletal',
    'Minor Salivary Gland': 'Minor_Salivary_Gland',
    'Nerve - Tibial': 'Nerve_Tibial',
    'Ovary': 'Ovary',
    'Pituitary': 'Pituitary',
    'Prostate': 'Prostate',
    'Skin - Not Sun Exposed (Suprapubic)': 'Skin_Not_Sun_Exposed_Suprapubic',
    'Skin - Sun Exposed (Lowerleg)': 'Skin_Sun_Exposed_Lowerleg',
    'Testis': 'Testis',
    'Thyroid': 'Thyroid',
    'Uterus': 'Uterus',
    'Vagina': 'Vagina',
    'Whole Blood': 'Whole_Blood'
}
from api.v1.paths import session_dir_path
from api.v1.paths import files_path

SESSION_DIR_PATH = session_dir_path()
current_dir = files_path()


def translate_to_hgnc(genes):
    genes_splitted = [g for g in genes.split(';') if g] if isinstance(genes, str) else genes
    ens_objs_dict = {ens_obj.Gene_ID: ens_obj.HGNC_symbol for ens_obj in
                     Ens_to_hgnc.query.filter(Ens_to_hgnc.Gene_ID.in_(genes_splitted))}
    return [ens_objs_dict.get(gene, '') for gene in genes_splitted]


def translate_to_ens(genes):
    hgnc_symbols = [gene for gene in genes.split(';') if gene] if isinstance(genes, str) else genes
    ens_objs_dict = {ens_obj.HGNC_symbol: ens_obj.Gene_ID for ens_obj in
                     Ens_to_hgnc.query.filter(Ens_to_hgnc.HGNC_symbol.in_(hgnc_symbols))}
    return [ens_objs_dict.get(gene, '') for gene in hgnc_symbols]


def translate_to_hgnc_no_order_importance(genes):
    from api.v1.models import Ens_to_hgnc
    output = []
    genes_output = Ens_to_hgnc.query.filter(and_(Ens_to_hgnc.HGNC_symbol != "", Ens_to_hgnc.Gene_ID.in_(genes))).all()
    for gene in genes_output:
        output.append(gene.HGNC_symbol)
    return output


def generate_processes_by_gene(gene):
    from api.v1.models import Proccesses_and_Hgnc
    rows = Proccesses_and_Hgnc.query.filter(Proccesses_and_Hgnc.Genes.contains(gene)).all()
    data2return = []
    for row in rows:
        data2return.append(getattr(row, 'Process name'))
    return data2return


def generate_processes_by_genes(gene_list):
    from api.v1.models import Proccesses_and_Hgnc
    gene_process_dict = {}
    for gene in gene_list:
        rows = Proccesses_and_Hgnc.query.filter(Proccesses_and_Hgnc.Genes.contains(gene)).all()
        for row in rows:
            process_name = getattr(row, 'Process name')
            gene_process_dict.setdefault(gene, []).append(process_name)
    processes_in_intersection = list(reduce(lambda x, y: x & y, map(set, gene_process_dict.values())))
    return processes_in_intersection


def load_file_from_storage(session_id, mode, time_stamp):
    try:
        user_dir = os.path.join(SESSION_DIR_PATH, session_id)
        path = os.path.join(user_dir, '{}_{}.json'.format(time_stamp, mode))
        with open(path) as json_file:
            data = json.load(json_file)
            return data
    except Exception as e:
        print(e)
        print("error while loading from storage")
        print(path)


def getScoreFromStorage(process, session_id):
    try:
        user_dir = os.path.join(SESSION_DIR_PATH, session_id)
        path = os.path.join(user_dir, '_scoreMatrix.json')
        with open(path) as json_file:
            data = json.load(json_file)
            return {tissue: data[tissue][process] for tissue in data.keys()}
    except:
        print("error while loading from storage")
        print(path)


def generate_single_process_data(process, mode, session_id, time_stamp):
    from api.v1.models import Scores_single_cell, Scores_gtex, Pvals, Genes_and_Go, Processes_with_defs
    from api.v1.tipa_per_context_users_data import get_scores_per_processes
    def zip_ensembs_hgncs(ensembs, hgncs):
        data2return = []
        ensembs = ensembs.split(';')
        hgncs = hgncs.split(';')
        for i, ensemb in enumerate(ensembs):
            if (ensemb != '' and hgncs[i] != '_'):
                data2return.append({'hgnc': hgncs[i], 'ens': ensemb})
        return data2return

    def round_pval(pval):
        if (pval < 0.01):
            return pval
        return round(pval, 2)

    if mode == 'dependentData':
        user_file = load_file_from_storage(session_id, "ContextDependent", time_stamp)
        tissues_rank = get_scores_per_processes(user_file, [process])
    else:
        Scores = Scores_single_cell if mode == 'singleCell' else Scores_gtex
        tissues_rank = Scores.query.filter(process == Scores.Process).all()

    tissues_pvals = Pvals.query.filter(process == Pvals.Process).all()
    ensembs = Genes_and_Go.query.filter(process == Genes_and_Go.process).all()[0].genes
    go = Genes_and_Go.query.filter(process == Genes_and_Go.process).all()[0].go
    try:
        definition = Processes_with_defs.query.filter(process == Processes_with_defs.process).all()[0].definition
    except:
        definition = 'No available description'
    hgncs = ";".join(translate_to_hgnc(ensembs))
    genes_obj = zip_ensembs_hgncs(ensembs, hgncs)
    data2return = [{'genes': genes_obj, 'go': go, 'definition': definition}]
    tissues_dict = single_cell_tissues_dict if mode == "singleCell" else gtex_cell_tissues_dict
    if mode == 'singleCell' or mode == 'gtex':
        for tissue_pval in tissues_pvals:
            for tissue_rank in tissues_rank:
                data2return.append({t[0]: [str(float(round_pval(getattr(tissue_pval, t[1])))),
                                           str(float(round(getattr(tissue_rank, t[1]), 2)))] for t in
                                    tissues_dict.items()})
    else:
        data2return.append(
            {tissue: [str(float(0)), str(float(round(tissues_rank[tissue][process], 2)))] for tissue in tissues_rank})
    return data2return


def generate_single_process_data_MSigDB(process, mode, session_id, time_stamp):
    from api.v1.models import Scores_MSigDB, MsigDB_descrption
    def zip_ensembs_hgncs(ensembs, hgncs):
        data2return = []
        ensembs = ensembs.split(';')
        hgncs = hgncs.split(';')
        for i, ensemb in enumerate(ensembs):
            if (ensemb != '' and hgncs[i] != '_'):
                data2return.append({'hgnc': hgncs[i], 'ens': ensemb})
        return data2return

    genes = ";".join(MSigDB_genes.genes_process[process])
    ensembs = translate_to_ens(genes)
    if mode:
        user_file = load_file_from_storage(session_id, "ContextDependent", time_stamp)
        user_diff_vals_matrix = pd.read_csv(StringIO(user_file), sep=',', index_col=0)
        user_diff_vals_matrix = user_diff_vals_matrix.loc[:, ~user_diff_vals_matrix.columns.str.contains('^Unnamed')]
        conditions = user_diff_vals_matrix.columns.values.tolist()
        user_query_scores_df = pd.DataFrame(index=[process], columns=conditions)
        gene_values_df = user_diff_vals_matrix[user_diff_vals_matrix.index.isin(ensembs)]
        for c in conditions:
            score = calculate_tipa(gene_values_df[c].tolist())
            user_query_scores_df.loc[process, c] = score
        tissues_rank = user_query_scores_df.to_dict()
    else:
        tissues_rank = Scores_MSigDB.query.filter(process == Scores_MSigDB.Process).all()
    genes_obj = zip_ensembs_hgncs(";".join(ensembs), genes)
    msigdb = MsigDB_descrption.query.filter(MsigDB_descrption.Process == process).all()
    data2return = [{'genes': genes_obj, 'systematic': msigdb[0].Systematic_name, 'definition': msigdb[0].Description}]
    if mode:
        data2return.append(
            {tissue: [str(float(0)), str(float(round(tissues_rank[tissue][process], 2)))] for tissue in tissues_rank})
    else:
        for tissue_rank in tissues_rank:
            data2return.append({t[0]: ["", str(float(round(getattr(tissue_rank, t[1]), 2)))] for t in
                                gtex_cell_tissues_dict.items()})
    return data2return


def generate_multiple_process_MSigDB(mode, session_id, time_stamp):
    from api.v1.models import Scores_MSigDB, MsigDB_descrption
    data2return = []
    paths_genes_file_reader = csv.reader(open(current_dir + 'msigdb.csv'))
    for line in paths_genes_file_reader:
        try:
            process_to_send = line[0]
            msigdb = MsigDB_descrption.query.filter(MsigDB_descrption.Process == process_to_send).all()
            dict = {'process': process_to_send, 'systematic': msigdb[0].Systematic_name}
            if mode:
                genes = ";".join(MSigDB_genes.genes_process[process_to_send])
                ensembs = translate_to_ens(genes)
                user_file = load_file_from_storage(session_id, "ContextDependent", time_stamp)
                user_diff_vals_matrix = pd.read_csv(StringIO(user_file), sep=',', index_col=0)
                user_diff_vals_matrix = user_diff_vals_matrix.loc[:,
                                        ~user_diff_vals_matrix.columns.str.contains('^Unnamed')]
                conditions = user_diff_vals_matrix.columns.values.tolist()
                user_query_scores_df = pd.DataFrame(index=[process_to_send], columns=conditions)
                gene_values_df = user_diff_vals_matrix[user_diff_vals_matrix.index.isin(ensembs)]
                for c in conditions:
                    score = calculate_tipa(gene_values_df[c].tolist())
                    user_query_scores_df.loc[process_to_send, c] = score
                tissues_rank_list = user_query_scores_df.to_dict()
                tissue_rank = {item[0]: item[1][process_to_send] for item in tissues_rank_list.items()}
                tissues_rank_dict = {'ranks': {tissue: tissue_rank[tissue] for tissue in tissue_rank.keys()}}
            else:
                tissue_rank = Scores_MSigDB.query.filter(process_to_send == Scores_MSigDB.Process).all()
                tissues_rank_dict = {
                    'ranks': {t[0]: str(float(round(getattr(tissue_rank[0], t[1]), 2))) for t in
                              gtex_cell_tissues_dict.items()}}
            data2return.append({**dict, **tissues_rank_dict})
        except Exception as e:
            print("Cant find data for:", process_to_send)
            print(e)

    return sorted(data2return, key=lambda k: k['process'])


def genterate_rank_processes_data_MSigDB(tissue, mode, session_id, time_stamp):
    from api.v1.models import Scores_MSigDB, Fc_for_tissues, MsigDB_descrption
    tissues_dict = dependentData_cell_tissues_dict if mode else gtex_cell_tissues_dict

    def extract_fc(genes):
        output = []
        for gene in genes:
            if gene != '':
                try:
                    fc = Fc_for_tissues.query.filter(Fc_for_tissues.gene == gene).first()
                    value = getattr(fc, tissues_dict[tissue]) if fc else None
                    output.append(str(round(value, 2)) if value is not None else "")
                except Exception as e:
                    print(e)
                    print("can't find gene:", gene)
                    output.append("")
        return ';'.join(output)

    def getScoreFromStorageByTissue(processes):
        try:
            user_condition_query = tissue
            user_file = load_file_from_storage(session_id, "ContextDependent", time_stamp)
            user_diff_vals_matrix = pd.read_csv(StringIO(user_file), sep=',', index_col=0)
            msigdb = MsigDB_descrption.query.all()
            process_genes_file_list = [
                {
                    'process': process.Process,
                    'genes': translate_to_ens(';'.join(MSigDB_genes.genes_process[process.Process])),
                    'systematic': process.Systematic_name
                }
                for process in msigdb
                if process.Process in processes
            ]
            process_genes_df = pd.DataFrame(process_genes_file_list).set_index('process')
            process_list = process_genes_df.index.values.tolist()
            tipa_matrix = pd.DataFrame(index=process_list, columns=[user_condition_query])
            for p in process_list:
                current_genes_list = process_genes_df.loc[p, 'genes']
                try:
                    current_gene_matrix = user_diff_vals_matrix.loc[
                        user_diff_vals_matrix.index.intersection(current_genes_list)]
                except:
                    print('Process genes are not found in user file')
                values = current_gene_matrix.loc[:, user_condition_query].tolist()
                tipa_matrix.loc[p, user_condition_query] = calculate_tipa(values)
            tipa_matrix = tipa_matrix.sort_values(by=user_condition_query, ascending=False)
            data = tipa_matrix.to_dict()
            extracted_processes = processes if len(processes) > 0 else data[tissue].keys()
            return {process: data[tissue][process] for process in extracted_processes}
        except Exception as e:
            print(e)
            print("error while loading from storage")

    if mode:
        tissues_rank = getScoreFromStorageByTissue(MSigDB_genes.genes_process.keys())
        data2return = sorted(
            [[process, str(float(tissues_rank[process]))] for process in tissues_rank.keys()],
            key=lambda x: float(x[1]),
            reverse=True)[:20]
    else:
        data2return = Scores_MSigDB.query \
            .with_entities(Scores_MSigDB.Process, getattr(Scores_MSigDB, tissues_dict[tissue])) \
            .order_by(getattr(Scores_MSigDB, tissues_dict[tissue]).desc()) \
            .limit(20) \
            .all()

    data2return = [[process, str(float(score))] for process, score in data2return]
    for item in data2return:
        process_name = item[0]
        try:
            msigdb = MsigDB_descrption.query.filter(MsigDB_descrption.Process == process_name).first()
            genes = MSigDB_genes.genes_process[process_name]
            ens = translate_to_ens(genes)
            fcs = extract_fc(ens)
            go = msigdb.Systematic_name
            definition = msigdb.Description
            item.append({'hgncs': genes, 'systematic': go, 'ens': ";".join(ens), 'fcs': fcs, 'definition': definition})
        except Exception as e:
            print("error:", e)
    return data2return


def generate_multiple_process_data(processes, mode, session_id, time_stamp):
    from api.v1.models import Scores_single_cell, Scores_gtex, Genes_and_Go
    from api.v1.tipa_per_context_users_data import get_scores_per_processes
    Scores = Scores_single_cell if mode == 'singleCell' else Scores_gtex
    tissues_dict = single_cell_tissues_dict if mode == "singleCell" else gtex_cell_tissues_dict
    process_list = processes.split(';')
    data2return = []
    if mode == 'dependentData':
        user_file = load_file_from_storage(session_id, "ContextDependent", time_stamp)
        tissues_rank_list = get_scores_per_processes(user_file, process_list)
    for process in process_list:
        if mode == 'dependentData':
            tissue_rank = {item[0]: item[1][process] for item in tissues_rank_list.items()}
        else:
            tissue_rank = Scores.query.filter(Scores.Process == process).all()
        go_for_process = Genes_and_Go.query.filter(Genes_and_Go.process == process).all()
        try:
            process_to_send = go_for_process[0].process if go_for_process else None
            go_to_send = go_for_process[0].go if go_for_process else None
            if len(process_to_send) > 0 and len(go_to_send) > 0:
                go_dict = {'process': process_to_send, 'go': go_to_send}
                if mode == 'dependentData':
                    tissues_rank_dict = {'ranks': {tissue: tissue_rank[tissue] if tissue_rank else None for tissue in tissue_rank.keys()}}
                else:
                    tissues_rank_dict = {
                        'ranks': {t[0]: str(float(round(getattr(tissue_rank[0], t[1]), 2))) if tissue_rank else None for t in
                                  tissues_dict.items()}}
                data2return.append({**go_dict, **tissues_rank_dict})
        except:
            print("Cant find data for:", process)
    return data2return


def genterate_rank_processes_data(tissue, threshold, checked, mode, session_id, time_stamp):
    from api.v1.models import Scores_single_cell, Scores_gtex, Genes_and_Go, Processes_and_DGs, Processes_with_defs, \
        Fc_for_tissues
    from api.v1.tipa_per_context_users_data import get_scores_per_tissue
    Scores = Scores_single_cell if mode == 'singleCell' else Scores_gtex
    tissues_dict = dependentData_cell_tissues_dict if mode == "dependentData" else gtex_cell_tissues_dict

    def create_proceeses_withDG_list():
        return [process_and_DG.process for process_and_DG in Processes_and_DGs.query.all()]

    def extract_fc(genes):
        splitted_genes = genes.split(';')
        output = []
        for gene in splitted_genes:
            if gene != '':
                try:
                    fc = Fc_for_tissues.query.filter(Fc_for_tissues.gene == gene).all()[0]
                    output.append(str(round(getattr(fc, tissues_dict[tissue]), 2)))
                except Exception as e:
                    print(e)
                    print("can't find gene:", gene)
        return ';'.join(output)

    def getScoreFromStorageByTissue(processes):
        try:
            data = get_scores_per_tissue(load_file_from_storage(session_id, "ContextDependent", time_stamp), tissue)
            extracted_processes = processes if len(processes) > 0 else data[tissue].keys()
            return {process: data[tissue][process] for process in extracted_processes}
        except:
            print("error while loading from storage")

    if (checked == 'true'):
        proccesses_with_DG = create_proceeses_withDG_list()
        if (mode == 'dependentData'):
            tissues_rank = getScoreFromStorageByTissue(proccesses_with_DG)
        else:
            tissues_rank = Scores.query.filter(Scores.Process.in_(proccesses_with_DG)).all()
    else:
        if (mode == 'dependentData'):
            tissues_rank = getScoreFromStorageByTissue([])
        else:
            tissues_rank = Scores.query.all()
    if (mode == 'dependentData'):
        data2return = [[process, str(float(tissues_rank[process]))] for process in tissues_rank.keys()]
    else:
        data2return = [[tissue_rank.Process, str(float(getattr(tissue_rank, tissues_dict[tissue])))] for tissue_rank in
                       tissues_rank]
    data2return = sorted(data2return, key=lambda x: float(x[1]), reverse=True)[
                  :int(threshold)]  # get top <threshold> tuples sorted by process's values
    chosen_processes_names = [x[0] for x in data2return]
    pathways_genes = api.v1.pathways_genes_size_filtered.pathways_genes_to_return
    term_to_name = api.v1.term2name.term2name
    for i, process_name in enumerate(chosen_processes_names):
        try:
            gene_and_go = Genes_and_Go.query.filter(Genes_and_Go.process == process_name)[0]
            genes = gene_and_go.genes
            hgncs = translate_to_hgnc(genes)
            fcs = extract_fc(genes)
            go = gene_and_go.go
        except:
            for key in term_to_name.keys():
                if term_to_name[key] == process_name:
                    go = key
                    break
            genes = pathways_genes[go]
            hgncs = translate_to_hgnc(genes)
            genes = ';'.join(genes)
            fcs = extract_fc(genes)
        try:
            definition = Processes_with_defs.query.filter(Processes_with_defs.process == process_name)[0].definition
        except:
            definition = "No available description"
        try:
            data2return[i].append({'hgncs': hgncs, 'go': go, 'ens': genes, 'fcs': fcs, 'definition': definition})
        except:
            print("error:", i)
    return data2return


def extract_features_from_file(user_file):
    lines = user_file.splitlines()
    formatted_file = csv.DictReader(lines, delimiter=',')
    list_of_rows_names = translate_to_hgnc_no_order_importance([row['ENSG'] for row in list(formatted_file)])
    formatted_file = csv.DictReader(lines, delimiter=',')
    dict_from_csv = dict(list(formatted_file)[0])
    list_of_column_names = list(dict_from_csv.keys())[1:]
    return {'tissues': list_of_column_names, 'genes': list_of_rows_names}


def extract_clusters_names(file):
    import csv
    lines = file.splitlines()
    formatted_file = csv.DictReader(lines, delimiter=',')
    clusters = []
    for row in formatted_file:
        clusters.append(row['cluster'])
    unique_clusters = list(set(clusters))
    return unique_clusters


def add_genes_gos(ranks):
    from api.v1.models import Genes_and_Go, Processes_with_defs
    pathways_genes = api.v1.pathways_genes_size_filtered.pathways_genes_to_return
    genes_to_hgns = api.v1.ens_hgnc_2022.ens_to_gene
    term_to_name = api.v1.term2name.term2name
    data2return = []
    for i, rank in enumerate(ranks.items()):
        process_name = rank[0]
        score = rank[1]
        try:
            definition = Processes_with_defs.query.filter(Processes_with_defs.process == process_name)
            go = definition[0].go
            definition = definition[0].definition
        except:
            definition = 'No available description'
            for i in term_to_name.keys():
                if term_to_name[i] == process_name:
                    go = i
                    break
        genes = []
        hgncs = []
        try:
            genes = pathways_genes[go]
            hgncs = []
            for g in genes:
                try:
                    hgncs.append(genes_to_hgns[g])
                except:
                    hgncs.append("")
            data2return.append([{'processName': process_name, 'score': round(score, 2), 'go': go, 'hgncs': hgncs,
                                 'genes': ';'.join(genes), 'definition': definition}])
        except:
            print("error add_genes_gos")
    return data2return


def create_session_dir(user_name):
    dir_creation_succeded = False
    try:
        user_dir = os.path.join(SESSION_DIR_PATH, user_name)
        if not os.path.isdir(user_dir):
            os.mkdir(user_dir)
        dir_creation_succeded = True
    except:
        print("dir creation failed")
    return dir_creation_succeded


def create_result_file(time_stamp, job_type, session_id, result):
    user_dir = os.path.join(SESSION_DIR_PATH, session_id)
    result_file_path = os.path.join(user_dir, '{}_{}.json'.format(time_stamp, job_type))
    f = open(result_file_path, 'w')
    if job_type == "scoreMatrix":
        f.write(result)
    else:
        f.write(json.dumps(result))
    f.close()
    return True


def create_result_cluster_file(time_stamp, job_type, session_id, result, cluster):
    user_dir = os.path.join(SESSION_DIR_PATH, session_id)
    result_file_path = os.path.join(user_dir, '{}_{}_{}.json'.format(time_stamp, job_type, cluster))
    f = open(result_file_path, 'w')
    if job_type == "scoreMatrix":
        f.write(result)
    else:
        f.write(json.dumps(result))
    f.close()
    return True


def get_session_results(session_id, timestamp, job_type):
    result = "error"
    session_dir = os.path.join(SESSION_DIR_PATH, session_id)
    results_path = os.path.join(session_dir, '{}_{}.json'.format(timestamp, job_type))
    if os.path.exists(results_path):
        try:
            f = open(results_path)
            result = f.read()
            result = json.loads(result)
        except Exception as e:
            print(e)
            print("fetching file failed")
    return result


def get_session_cluster_results(session_id, timestamp, job_type, cluster):
    result = "error"
    session_dir = os.path.join(SESSION_DIR_PATH, session_id)
    results_path = os.path.join(session_dir, '{}_{}_{}.json'.format(timestamp, job_type, cluster))
    if os.path.exists(results_path):
        try:
            f = open(results_path)
            result = f.read()
            result = json.loads(result)
        except Exception as e:
            print(e)
            print("fetching file failed")
    else:
        results_path = os.path.join(session_dir, '{}_{}.json'.format(timestamp, job_type)) #to find the example Top preferentially active processes per subset
        if os.path.exists(results_path):
            try:
                f = open(results_path)
                result = f.read()
                result = json.loads(result)
            except Exception as e:
                print(e)
                print("fetching file failed")
    return result
