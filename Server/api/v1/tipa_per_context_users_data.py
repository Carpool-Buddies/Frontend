# -*- coding: utf-8 -*-
"""
Created on Wed Jan 26 15:19:58 2022

@author: moran
"""
import csv
from io import StringIO

import pandas as pd
from scipy import stats
import time


'''
input:
======
    matrix of ENS genes, tissues/conditions and differntial expression values. 

    list of query processes or query condition (e.g. tissue)

output:
=======
    matirx of scores of query processes in all conditions or matrix of scores of all processes in query condition. 
'''

start = time.time()
from api.v1.paths import files_path
from api.v1.models import Genes_and_Go

def generate_process_genes_df():
    process_genes_file_from_sql = Genes_and_Go.query.all()
    process_genes_file_list = [{'process': row.process, 'genes': row.genes, 'go': row.go} for row in
                               process_genes_file_from_sql]
    process_genes_df = pd.DataFrame(process_genes_file_list)
    process_genes_df = process_genes_df.set_index('process')
    return process_genes_df

def calculate_tipa(current_values):
    try:
        sorted_genes_vals = sorted(current_values)
        current_mean = stats.trim_mean(sorted_genes_vals, 0.1)  # calculation of TiPA score

    except:
        print('Error in calculating TiPA')

    return current_mean


def get_scores_per_processes(user_file, user_proceeses_list):
    user_diff_vals_matrix = pd.read_csv(StringIO(user_file), sep=',', index_col=0)
    user_diff_vals_matrix = user_diff_vals_matrix.loc[:, ~user_diff_vals_matrix.columns.str.contains('^Unnamed')]
    conditions = user_diff_vals_matrix.columns.values.tolist()
    processes_and_genes_df = generate_process_genes_df()##### insert here df from db
    user_query_scores_df = pd.DataFrame(index = user_proceeses_list, columns = conditions)
    for user_process in user_proceeses_list:
        try:
            user_process_genes = processes_and_genes_df.loc[user_process, "genes"]
            user_process_genes = user_process_genes.split(';')[:-1]
            gene_values_df = user_diff_vals_matrix[user_diff_vals_matrix.index.isin(user_process_genes)]
            for c in conditions:
                score = calculate_tipa(gene_values_df[c].tolist())
                user_query_scores_df.loc[user_process, c] = score
        except:
            print('Query process is not found')

    return user_query_scores_df.to_dict()


def get_scores_per_tissue(user_file, user_condition_query):
    '''
    This function gets matrix of FC values of genes in different tissues/conditions and a query condition.
    returns matrix of scores for processes (rows) in query condition.
    '''
    user_diff_vals_matrix = pd.read_csv(StringIO(user_file), sep=',', index_col=0)
    process_genes_df = generate_process_genes_df()
    process_list = process_genes_df.index.values.tolist()
    tipa_matrix = pd.DataFrame(index=process_list, columns=[user_condition_query])
    tipa_process_genes = {}

    for p in process_list:
        current_genes = process_genes_df.loc[p, 'genes']
        current_genes_list = current_genes.split(';')[:-1]

        try:
            current_gene_matrix = user_diff_vals_matrix.loc[
                user_diff_vals_matrix.index.intersection(current_genes_list)]
        except:
            print('Process genes are not found in user file')

        genes_for_tipa = current_gene_matrix.index.tolist()
        tipa_process_genes[p] = genes_for_tipa

        values = current_gene_matrix.loc[:, user_condition_query].tolist()
        tipa = calculate_tipa(values)
        tipa_matrix.loc[p, user_condition_query] = tipa

    tipa_matrix = tipa_matrix.sort_values(by=user_condition_query, ascending=False)

    return tipa_matrix.to_dict()
