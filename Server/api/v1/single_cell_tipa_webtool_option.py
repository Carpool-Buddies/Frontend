# -*- coding: utf-8 -*-
"""
Created on Sun Sep  5 15:25:11 2021

@author: moran
"""
import csv
import statistics
from io import StringIO

import pandas as pd
from scipy import stats


def calculate_tipa(current_values):
    sorted_genes_vals = sorted(current_values)
    current_mean = stats.trim_mean(sorted_genes_vals, 0.1)  # calculation of TiPA score
    return current_mean


def find_path_in_subset(current_subset, genes_in_df, processes_genes_in_groups_analysis,
                        process_groups):  # , genes_in_paths_threshold):

    scores_dict = {}
    path_genes_for_tipa = {}

    for path in processes_genes_in_groups_analysis:
        genes_in_current_path = []
        for gene in processes_genes_in_groups_analysis[path]:

            if gene.upper() in genes_in_df:  # gene has FC value and involve in some path
                genes_in_current_path.append(gene.upper())

        current_values = current_subset[genes_in_current_path].values.tolist()
        current_values = [x for x in current_values if str(x) != 'nan']
        if len(current_values) >= 1:
            path_genes_for_tipa[path] = genes_in_current_path
            current_tipa = calculate_tipa(current_values)
            scores_dict[path] = current_tipa

    mean_tipa = {}
    for group in process_groups:
        scores = []
        for p in process_groups[group]:
            if p in scores_dict:
                scores.append(scores_dict[p])
        if len(scores) > 0:
            mean_group = statistics.mean(scores)
            mean_tipa[group] = mean_group

    return scores_dict, mean_tipa


def building_dataframe_sc(user_file, processes_genes_in_groups_analysis, only_genes, process_gorups):
    ''' read "FC value" '''
    tis_fc_df = pd.read_csv(StringIO(user_file), sep=',')
    tis_fc_df['cluster'] = tis_fc_df['cluster'].astype(str)
    tis_fc_df['gene'] = tis_fc_df['gene'].astype(str)
    tis_fc_df = tis_fc_df.drop_duplicates(subset=['cluster', 'gene'], keep='first')
    tis_fc_df['gene'] = tis_fc_df['gene'].str.upper()
    try:
        tis_fc_df = tis_fc_df.pivot(index='gene', columns='cluster', values='avg_logFC')
    except:
        tis_fc_df = tis_fc_df.pivot(index='gene', columns='cluster', values='avg_log2FC')
    genes_in_df = tis_fc_df.index.tolist()  # genes with FC value
    genes_in_paths_and_in_df = set()
    for gene in genes_in_df:
        if gene.upper() in only_genes:  # gene with FC is also in at least one path and therefore needed for analysis
            genes_in_paths_and_in_df.add(gene.upper())
    full_scores_dict = {}
    mean_tipa_dict = {}
    i = 0
    for j in tis_fc_df.columns:
        full_scores_dict[j] = {}  # i +1
        current_subset = tis_fc_df.iloc[:, i]
        scores_dict, mean_tipa_per_subset = find_path_in_subset(current_subset, genes_in_df,
                                                                processes_genes_in_groups_analysis, process_gorups)
        full_scores_dict[j] = scores_dict  # i + 1
        mean_tipa_dict[j] = mean_tipa_per_subset
        i += 1
    # All scores of All subsets in current tissue together
    # =====================================================
    full_scores_df = pd.DataFrame.from_dict(full_scores_dict)
    full_scores_df = full_scores_df.dropna(axis=0, how="all")
    full_scores_df = full_scores_df.fillna('No available data')
    return full_scores_df, mean_tipa_dict, genes_in_paths_and_in_df, genes_in_df


def get_ans(user_file):
    genes = set()
    processes_genes_in_groups_analysis = {}
    with open(current_dir + 'processes_and_genes_in_cell_types_analysis_HGNC.csv') as file:
        groups_path_reader = csv.reader(file)
        for row in groups_path_reader:
            processes_genes_in_groups_analysis[row[0]] = [g for g in row[1:] if g != '']
            genes.update(processes_genes_in_groups_analysis[row[0]])
    process_gorups = {}
    groups_path_reader = csv.reader(open(current_dir + 'cell_types_and_associated_process.csv'))
    for row in groups_path_reader:
        processes = [p for p in row[1:] if p != '']
        process_gorups[row[0]] = processes
    process_and_its_cell_types = {}
    for cell_type in process_gorups:
        for p in process_gorups[cell_type]:
            if p not in process_and_its_cell_types:
                process_and_its_cell_types[p] = []
            process_and_its_cell_types[p].append(cell_type)

    process_and_its_cell_types_for_table = {}
    for p in process_and_its_cell_types:
        process_and_cell_type_for_value = str(p) + ' ' + str(process_and_its_cell_types[p])
        process_and_its_cell_types_for_table[p] = process_and_cell_type_for_value

    processes_scores_df, cell_types_scores_dict, genes_to_display, genes_in_user_df = building_dataframe_sc(user_file,
                                                                                                            processes_genes_in_groups_analysis,
                                                                                                            genes,
                                                                                                            process_gorups)

    processes_scores_df = processes_scores_df.reset_index()
    processes_scores = processes_scores_df.replace({"index": process_and_its_cell_types_for_table})
    processes_scores = processes_scores.rename({'index': 'Process name and associated cell types(s)'}, axis='columns')
    processes_scores = processes_scores.set_index('Process name and associated cell types(s)')
    processes_scores = processes_scores.dropna(how='all')
    processes_scores_dict = processes_scores.to_dict('index')
    cell_types_scores_df = pd.DataFrame(cell_types_scores_dict)
    cell_types_scores_df = cell_types_scores_df.dropna(how='all')
    cell_types_scores_df = cell_types_scores_df.fillna('No available data')

    return cell_types_scores_df, len(genes_to_display), len(genes_in_user_df), processes_scores_dict


from api.v1.paths import files_path

current_dir = files_path()




def get_ranks(user_file):
    ans_df, number_of_genes_in_processes, num_of_genes_in_user_file, data_to_download = get_ans(user_file)
    return {'data': ans_df.to_dict(), 'number_of_genes_in_processes': number_of_genes_in_processes,
            'num_of_genes_in_user_file': num_of_genes_in_user_file, 'data_to_download': data_to_download}
