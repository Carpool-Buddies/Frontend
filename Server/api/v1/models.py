from api.v1.database import db
from sqlalchemy import func


# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


# class Pvals(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['v8_adj_pval']
#
# class Scores_single_cell(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['scores_matrix4']
#
# class Scores_gtex(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['gtex_score_matrix']
#
# class Scores_MSigDB(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['tipa_v8_msigdb']
#
# class MsigDB_descrption(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['MsigDB_descrption']
#
# class Genes_and_Go(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['processes_with_genes_and_gos_v8']
#
# class Proccesses_and_Hgnc(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['processesToHgnc']
#
# class Processes_and_DGs(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['processes_and_DGs']
#
# class Ens_to_hgnc(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['ens_hgnc_2022']
#
# class Processes_with_defs(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['processes_go_definitions']
#
# # Scores_gtex, Pvals, Genes_and_Go, Processes_with_defs
# class Fc_for_tissues(db.Model):
#     __bind_key__ = 'TiPA'
#     __table_args__ = {'schema': 'TiPA'}
#     __table__ = db.Model.metadata.tables['FC_values_all_tissues_v8']
#
#
#     @classmethod
#     def random_gene(cls):
#         return cls.query.order_by(func.random()).first().SourceName
#
#
# class Updates(db.Model):
#     __bind_key__ = 'Interactions'
#     __table_args__ = {'schema': 'Interactions'}
#     __table__ = db.Model.metadata.tables['Updates']
#
#     @classmethod
#     def getWorkingVersion(cls):
#         q = cls.query.all()
#         if q[0].Date > q[1].Date:
#             return q[0].DBv
#         else:
#             return q[1].DBv
#
# class GeneToDisease(db.Model): #Interactions
#     __bind_key__ = 'Interactions'
#     __table__ = db.Model.metadata.tables['GeneToDisease']
#
# class NamesA(db.Model):
#     import re
#     __bind_key__ = 'Interactions'
#     __table_args__ = {'schema': 'Interactions'}
#     __table__ = db.Model.metadata.tables['NamesA']
#     ENSEMBL_RE = re.compile(
#         "ENS[A-Z]+[0-9]{11}|[A-Z]{3}[0-9]{3}[A-Za-z](-[A-Za-z])?|CG[0-9]+|[A-Z0-9]+\.[0-9]+|YM[A-Z][0-9]{3}[a-z][0-9]")
#     ENTREZ_RE = re.compile("[0-9]+|[A-Z]{1,2}_[0-9]+|[A-Z]{1,2}_[A-Z]{1,4}[0-9]+")
#
#     @classmethod
#     def common_name(cls, ensembl):
#         return cls.query.filter(Ensembl=ensembl).limit(1).first().Symbol
#
#     @classmethod
#     def entrez(cls, ensembl):
#         return cls.query.filter(Ensembl=ensembl).limit(1).first().Entrez
#
#     @classmethod
#     def names(cls, gene):
#         if gene.isdigit():
#             return cls.query.filter(Entrez=gene).all()
#
#     @classmethod
#     def ensembl(cls, symbol):
#         try:
#             q = cls.query.filter_by(Symbol=symbol).all()
#             return q
#         except AttributeError:
#             return 'null'
#
#
#     @classmethod
#     def genes_list_to_ensembl(cls, list):
#         ensembles = []
#         for gene in list:
#             if cls.ENSEMBL_RE.match(gene):
#                 ensembles.append(gene)
#             else:
#                 listOfGene = cls.ensembl(gene)
#                 for ens in listOfGene:
#                     ensembles.append(ens.Ensembl)
#         return ensembles
#
#     @classmethod
#     def check_name(cls, gene):
#         if cls.ENSEMBL_RE.match(gene):
#             return [cls.query.filter_by(Ensembl=gene).first().Ensembl]
#         elif cls.ENTREZ_RE.match(gene):
#             return set([gene.Ensembl for gene in cls.query.filter_by(Entrez=gene).distinct(cls.Ensembl).all()])
#         else:
#             return set([gene.Ensembl for gene in cls.query.filter_by(Symbol=gene).distinct(cls.Ensembl).all()])
#
#
# class NamesB(db.Model):  # Interactions
#     import re
#     __bind_key__ = 'Interactions'
#     __table__ = db.Model.metadata.tables['NamesB']
#     ENSEMBL_RE = re.compile(
#         "ENS[A-Z]+[0-9]{11}|[A-Z]{3}[0-9]{3}[A-Za-z](-[A-Za-z])?|CG[0-9]+|[A-Z0-9]+\.[0-9]+|YM[A-Z][0-9]{3}[a-z][0-9]")
#     ENTREZ_RE = re.compile("[0-9]+|[A-Z]{1,2}_[0-9]+|[A-Z]{1,2}_[A-Z]{1,4}[0-9]+")
#
#     @classmethod
#     def common_name(cls, ensembl):
#         return cls.query.filter(Ensembl=ensembl).limit(1).first().Symbol
#
#     @classmethod
#     def entrez(cls, ensembl):
#         return cls.query.filter(Ensembl=ensembl).limit(1).first().Entrez
#
#     @classmethod
#     def names(cls, gene):
#         if gene.isdigit():
#             return cls.query.filter(Entrez=gene).all()
#
#     @classmethod
#     def ensembl(cls, symbol):
#         try:
#             q = cls.query.filter_by(Symbol=symbol).first().Ensembl
#             return q
#         except AttributeError:
#             return 'null'
#
#
#     @classmethod
#     def genes_list_to_ensembl(cls, list):
#         ensembles = []
#         for gene in list:
#             if cls.ENSEMBL_RE.match(gene):
#                 ensembles.append(gene)
#             else:
#                 ensembles.append(cls.ensembl(gene))
#         return ensembles
#
#     @classmethod
#     def check_name(cls, gene):
#         if cls.ENSEMBL_RE.match(gene):
#             return [cls.query.filter_by(Ensembl=gene).first().Ensembl]
#         elif cls.ENTREZ_RE.match(gene):
#             return set([gene.Ensembl for gene in cls.query.filter_by(Entrez=gene).distinct(cls.Ensembl).all()])
#         else:
#             return set([gene.Ensembl for gene in cls.query.filter_by(Symbol=gene).distinct(cls.Ensembl).all()])

