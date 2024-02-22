const goTermsKeywords = [
  'regulat',
  'signal',
  'respons',
  'metabol',
  'develop',
  'receptor',
  'transport',
  'apopt',
  'translat',
  'organ',
  'morpho',
  'mediat',
  'kinase',
  'proliferat',
  'phospho',
  'transduc'
];

const evidenceCodes = [
  'EXP',
  'IDA',
  'IPI',
  'IMP',
  'IGI',
  'IEP',
  'ISS',
  'IBA',
  'IKR',
  'IRD',
  'RCA',
  'TAS',
  'NAS',
  'IC',
  'NDA',
  'IEA'
];

const weightings = [
  { key: 'uniform', text: 'Uniform weights', value: 'uniform' },
  { key: 'go', text: 'GO process biased', value: 'go' }
];

const goTypes = [
  { key: 'useBP', text: 'Use Biological Process', value: 'useBP' },
  { key: 'useMF', text: 'Use Molecular Function', value: 'useMF' },
  { key: 'useCC', text: 'Use Cellular Component', value: 'useCC' }
];

export default {
  goTermsKeywords,
  evidenceCodes,
  weightings,
  goTypes
};
