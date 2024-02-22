# -*- coding: utf-8 -*-
"""
Created on Mon Nov  8 14:15:43 2021

@author: moran
"""
from io import StringIO

import pandas as pd
import csv
from pprint import pprint
from scipy.stats import trim_mean
from scipy import stats
import random
import pickle
import os


'''
input:
    matrix of ENS genes, tissues/conditions and differntial expression values. 
    
    optional: table of process names & ENS genes
    
    
output:
    
    matirx of processes (ours or users) & tissues/conditions with TiPA values. 

'''
from api.v1.paths import files_path
current_dir = files_path()


def calculate_tipa(current_values):
    sorted_genes_vals = sorted(current_values)
    current_mean = stats.trim_mean(sorted_genes_vals, 0.1)  # calculation of TiPA score
    return current_mean

def build_scores_matrix(user_diff_vals_matrix, conditions):
    '''
    This function gets matrix of FC values of genes in different tissues/conditions.
    returns matrix of scores for processes (rows) in tissues/conditions (columns). 
    '''
    process_genes_df = pd.read_csv(current_dir +'processes_with_genes_and_gos.csv', index_col = 0)
    process_list = process_genes_df.index.values.tolist()
    tipa_matrix = pd.DataFrame(index = process_list, columns = conditions)
    tipa_process_genes = {}
    
    for p in process_list:
        current_genes = process_genes_df.loc[p, 'genes']
        current_genes_list = current_genes.split(';')
        current_genes_list = current_genes_list[:-1]
    
        if len(current_genes_list) < 3:
            print(p)
            print('Differntial gene expression is available for less than 3 genes. Please update the data and try again.')
        else:
            current_gene_matrix = user_diff_vals_matrix.loc[user_diff_vals_matrix.index.intersection(current_genes_list)]
            genes_for_tipa = current_gene_matrix.index.tolist()
            tipa_process_genes[p] = genes_for_tipa
            for condition in conditions:
                values = current_gene_matrix.loc[:, condition].tolist()
                tipa = calculate_tipa(values)
                tipa_matrix.loc[p, condition] = tipa
    
    return tipa_matrix, tipa_process_genes



    
# User's data
# ============
def get_score(user_file):
    user_diff_vals_matrix = pd.read_csv(StringIO(user_file), index_col = 0, sep=',')
    conditions = user_diff_vals_matrix.columns.values.tolist()
    ans_tipa_matrix, genes_for_tipa_dict = build_scores_matrix(user_diff_vals_matrix, conditions)
    return ans_tipa_matrix

    #ans_tipa_matrix.to_csv('C:/Users/moran/Google Drive/PhD/workspace/TIPA webtool/tipa_output.csv')





