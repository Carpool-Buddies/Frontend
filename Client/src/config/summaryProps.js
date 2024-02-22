const summaryParams = [
  'User Name',
  'Job name',
  'Job description',
  'Time',
  'Organism',
  'User Interactions File',
  'Requested Databases',
  'Weighting Algorithm',
  'Evidence codes',
  'GO process size limit',
  'Weight by GO Biological Process',
  'Weight by GO Molecular Function',
  'Weight by GO Cellular Component',
  'Database Version Date',
  'Global Total Nodes',
  'Global Total Edges'
]

const filterTissuesParams = [
  'Filter By Tissues',
  'Tissue Filter Threshold',
  'Tissue Filter Data-set',
  'Selected Tissue',
  'Tissue Filter Fold Change Function',
  'Saved Nodes After Tissue Expression Filter',
  'Saved Edges After Tissue Expression Filter'
];

const filterUserData = [
  'Filter By Expression Data',
  'Line Format of User Expression Data',
  'Fold-change format of User Expression Data',
  'Expression File Threshold',
  'Expression File p-value',
  'Saved Nodes After User Expression Data Filter',
  'Saved Edges After User Expression Data Filter'
];

const filterSC1 = [
  'Filter By User SC Data',
  'Number Of Subsets',
  'SC Data Gene Expression Threshold',
  'SC Data Fold-Change Function'
];

//   'Saved Nodes After User SC Data Filter - Cluster ',
//   'Saved Edges After User SC Data Filter - Cluster ',

const filterSC2 = [
  'Threshold Of Combined Interactome (percentage)',
  'Saved Nodes After User SC Data Filter - Combined Interactome',
  'Saved Edges After User SC Data Filter - Combined Interactome'
];

const networkParams = [
  'Average Clustering Coefficient',
  'Number of Connected Components',
  'Size of Largest Connected Component'
];

export {
  summaryParams, networkParams, filterTissuesParams, filterUserData, filterSC1, filterSC2
};
