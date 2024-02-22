import React, { useState, useEffect } from 'react';

export default {
  brain0Exp: 'Brain0 includes Anterior cingulate cortex (BA24), Frontal Cortex (BA9) and Cortex',
  brain1Exp: 'Brain1 includes Cerebellar Hemisphere and Cerebellum',
  brain2Exp: 'Brain 2 includes Caudate (basal ganglia), Nucleus accumbens (basal ganglia) and Putamen (basal ganglia)',
  brain3Exp: 'Brain3 includes Spinal cord (cervical c-1), and Substantia nigra',
  brain4Exp: 'Brain4 includes Hypothalamus',
  brain5Exp: 'Brain5 includes Amygdala and Hippocampus',

  interactionsData:
    'You can add interactions to the set of interactions selected above, or use your data only.'
    + ' The format is: name1, name2, entity1, entity2, type, weight(/n). EXAMPLE: FUS3, DAG1, Protein, Protein, PPI, 0.7',

  userExpData: <div>Upload a matrix of gene names (rows) and context (columns)</div>,

  userExpDataSamples: <div>Upload a matrix of gene names (rows) and samples (columns)</div>,

  tissueExp: 'Limit to interactions between genes expressed in tissue',

  weighting:
    'Weights between 0,1; Uniform weights: reflect reliability of detection method(s); GO process biased: also favor selected GO terms',

  evidence:
    'Limit to proteins whose annotation to a GO term is supported by selected evidence codes',

  goSize:
    'Avoid general GO terms by using an upper limit on number of proteins annotated to selected term(s)',

  keywords: 'Bias toward GO biological processes containing keyword',

  jobName: 'Please use letters, numbers, hyphens and underscores only. It allows you to find the job later',

  singleCellDataFormat:
    'Expected format: a header line with Gene Subset1 Subset2 etc.., followed by one line per gene'
};
