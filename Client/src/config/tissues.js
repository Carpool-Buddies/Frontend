const regularTissues = `Adipose - Subcutaneous
Adipose - Visceral (Omentum)
Artery - Aorta
Artery - Coronary
Artery - Tibial
Brain0
Brain1
Brain2
Breast - Mammary Tissue
Colon - Sigmoid
Esophagus - Gastroesophageal Junction
Esophagus - Mucosa
Esophagus - Muscularis
Heart - Atrial Appendage
Heart - Left Ventricle
Liver
Lung
Muscle - Skeletal
Nerve - Tibial
Ovary
Pituitary
Prostate
Skin - Not Sun Exposed (Suprapubic)
Skin - Sun Exposed (Lowerleg)
Testis
Thyroid
Uterus
Vagina
Whole Blood`

const gtexTissues = `Skin - Sun Exposed (Lower leg)
Adipose - Subcutaneous
Muscle - Skeletal
Artery - Tibial
Nerve - Tibial
Heart - Atrial Appendage
Heart - Left Ventricle
Thyroid
Lung
Testis
Prostate
Skin - Not Sun Exposed (Suprapubic)
Minor Salivary Gland
Brain0
Brain1
Whole Blood
Artery - Aorta
Adipose - Visceral (Omentum)
Esophagus - Gastroesophageal Junction
Esophagus - Mucosa
Esophagus - Muscularis
Breast - Mammary Tissue
Brain4
Brain3
Artery - Coronary
Liver
Pituitary
Brain5
Brain2
Vagina
Ovary
Uterus
Colon - Sigmoid
Adrenal Gland
`

const createTissuesList = (mode) => {
  const tissuesList = []
  Tissues = mode === 'regular' ? regularTissues : gtexTissues
  Tissues.split(/\r?\n/).forEach(tissue => {
    tissuesList.push(tissue)
  })
  return tissuesList
}

const tissuesList = (mode) => createTissuesList(mode)
export default tissuesList
