# -*- coding: utf-8 -*-
"""
Created on Mon Aug 16 08:39:30 2021

@author: moran
"""
from io import StringIO
import pandas as pd
from scipy import stats
import math


# Global Varaibles

import api.v1.pathways_genes_size_filtered
import api.v1.term2name
import api.v1.ens_hgnc_2022
from api.v1.paths import files_path

current_dir = files_path()

def building_dataframe_sc(user_file, query_cluster, path_genes, only_genes):
    ''' read "FC value" '''

    tis_fc_df = user_file
    tis_fc_df['cluster'] = tis_fc_df['cluster'].astype(str)
    tis_fc_df['gene'] = tis_fc_df['gene'].astype(str)

    tis_fc_df = tis_fc_df.drop_duplicates(subset=['cluster', 'gene'], keep='first')  # Dealing with duplicates:
    tis_fc_df = tis_fc_df.copy()
    tis_fc_df['gene'] = tis_fc_df['gene'].str.upper()

    try:
        tis_fc_df = tis_fc_df.pivot(index='gene', columns='cluster', values='avg_logFC')
    except:
        tis_fc_df = tis_fc_df.pivot(index='gene', columns='cluster', values='avg_log2FC')

    genes_in_df = tis_fc_df.index.tolist()  # genes with FC value
    genes_in_df = list(map(lambda g: g.upper(), genes_in_df))
    current_col = tis_fc_df.loc[:, query_cluster]
    scores_dict = find_path_in_subset(current_col, genes_in_df, path_genes)

    full_scores_dict = scores_dict

    # All scores of All subsets in current tissue together
    # =====================================================
    full_scores_df = pd.DataFrame(full_scores_dict, index=[0])
    full_scores_df = full_scores_df.dropna(axis=0, how="all").T

    return full_scores_df


# =============================================================================
# sub function of building_dataframe_sc.
# =============================================================================
def find_path_in_subset(current_subset, genes_in_df, pathways_genes_size_filtered):  # , genes_in_paths_threshold):
    scores_dict = {}
    path_genes_for_tipa = {}
    ens_to_genes = api.v1.ens_hgnc_2022.ens_to_gene
    for path in pathways_genes_size_filtered.keys():
        genes_in_current_path = []
        for gene in pathways_genes_size_filtered[path]:
            if len(gene) > 0:
                try:
                    gene_name = ens_to_genes[gene]
                    if len(gene_name) > 0:
                        if gene_name in genes_in_df:  # gene has FC value and involve in some path
                            genes_in_current_path.append(gene_name)
                except:
                    continue
        current_values = current_subset[genes_in_current_path].dropna().values.tolist()
        if len(current_values) >= 3:
            path_genes_for_tipa[path] = genes_in_current_path

            current_tipa = calculate_tipa(current_values)
            scores_dict[path] = current_tipa
    return scores_dict


def calculate_tipa(current_values):
    sorted_genes_vals = sorted(current_values)
    current_mean = stats.trim_mean(sorted_genes_vals, 0.1)  # calculation of TiPA score
    return current_mean


def df_with_GO_terms(term2name, scores_df):
    current_term2name = {}
    scores_df_1 = scores_df.copy()
    scores_df = scores_df
    terms = scores_df_1.index.tolist()
    for term in terms:
        if term in term2name:
            current_term2name[term] = term2name[term]
    scores_df = scores_df.rename(index=current_term2name)

    return scores_df


###############################################################

# prod_env

# path-tis
# =========
def get_ranks(query_cluster, uploaded_file, is_top_ten):
    only_genes = []
    user_file_df = pd.read_csv(StringIO(uploaded_file), sep=',')
    full_scores_df_all = building_dataframe_sc(user_file_df, query_cluster, api.v1.pathways_genes_size_filtered.pathways_genes_to_return, only_genes)
    final_Scores_df_for_display = df_with_GO_terms(api.v1.term2name.term2name, full_scores_df_all)
    final_Scores_df_for_display.columns = [query_cluster]
    final_Scores_df_for_display = final_Scores_df_for_display.sort_values(by=[query_cluster], ascending=False)
    if is_top_ten:
        final_Scores_df_for_display = final_Scores_df_for_display.head(10)
    final_Scores_df_for_display = final_Scores_df_for_display.to_dict()[query_cluster]
    for i in final_Scores_df_for_display.keys():
        if math.isnan(final_Scores_df_for_display[i]):
            final_Scores_df_for_display[i] = 'N/A'
    return final_Scores_df_for_display

# =============================================================================



