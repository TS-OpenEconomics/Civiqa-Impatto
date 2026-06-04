export interface IndicatoreRef {
  id: string
  code: string
  label: string
  note?: string
}

export interface SimpleRef {
  id: string
  codice?: string
  label: string
}

export interface TemaRelazione {
  id: string
  label: string
  descrizione: string
  nomeOpenCoesione: string
  missioniDup: SimpleRef[]
  policyObjectivesUe: SimpleRef[]
  rsoPrimari: SimpleRef[]
  besDomains: string[]
  indicatori: IndicatoreRef[]
  noteRaccordo?: string
}

export interface CategoriaRelazione {
  categoriaId: string
  categoria: string
  settoreId: string
  settore: string
  sottosettoreId: string
  sottosettore: string
  temaIds: string[]
  temi: string[]
  fabbisogni: { id: string; label: string }[]
  clusterCodes: string[]
  clusterLabels: string[]
  tipologie: { id: string; label: string }[]
}

export interface FabbisognoCompleto {
  id: string
  label: string
  descrizione: string
  sottolabel: string
  temaId: string
  temaLabel: string
  missioniDup: SimpleRef[]
  programmiDup: SimpleRef[]
  osAP: string[]
  osAPDescrizione: string
  clusterCup: { codice: string; label: string }[]
  scenarioZero: {
    q1Label: string
    q2Label: string
    q3Label: string
  }
  categorieCollegate: {
    id: string
    label: string
    settoreId: string
    settore: string
    sottosettoreId: string
    sottosettore: string
    clusterCode: string
  }[]
}

export interface LookupRecord {
  fabId: string
  fabLabel: string
  clusterId: string
  clusterLabel: string
  settoreId: string
  settore: string
  sottosettoreId: string
  sottosettore: string
  categoriaId: string
  categoria: string
  tipologiaId: string
  tipologia: string
  temaId: string
  temaLabel: string
  missioneDup: string
  osAP: string[]
  scenarioZeroQ1Label: string
}

export interface McaCriterio {
  id: string
  clusterId: string
  clusterLabel: string
  criterio: string
  domanda: string
  pesoDefault: string
  logicaPunteggio: string
  fonteVerifica: string
}

export interface RiskFactor {
  id: string
  clusterId: string
  clusterLabel: string
  categoriaRischio: string
  fattore: string
  pesoDefault: number
  descrizione: string
  mitigazioneSuggerita: string
}

export interface ClusterMCA {
  id: string
  label: string
  categorieIncluse: string[]
  criteriiKO: McaCriterio[]
  criteriiQualitativi: McaCriterio[]
  fattoriRischio: RiskFactor[]
}
