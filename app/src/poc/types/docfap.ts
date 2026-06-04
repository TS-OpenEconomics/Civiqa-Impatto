// DOCFAP domain types — Documento di Fattibilità e Proposta (D.Lgs. 36/2023 All. I.7)

// ── Supporting primitive types (shared with wizard steps) ──

export type NaturaCUP = 'infrastruttura' | 'servizio' | 'voucher' | 'contributo'

export type StatoOperativo = 'pieno' | 'parziale' | 'non_operativo'

export type LivelloMCA = 'Alto' | 'Medio' | 'Basso' | 'Nullo'

export type LivelloRischio = 'Alto' | 'Medio' | 'Basso' | 'Nullo'

export type UrgenzaIntervento = 'Critica' | 'Alta' | 'Media' | 'Bassa'

export type ClasseSismica =
  | 'Zona 1 (alta)'
  | 'Zona 2'
  | 'Zona 3'
  | 'Zona 4 (bassa)'

// ── Domain-specific types ──

export type AlternativaId = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5'

export type ErogazioneAttuale = 'totale' | 'parziale' | 'assente' | 'greenfield'

export type RobustezzaLevel = -1 | 0 | 1 | 2 | 3

export type CerTier =
  | 'L0-A'
  | 'L0-B'
  | 'L0-C'
  | 'L1-A'
  | 'L1-B'
  | 'L1-B-DUAL'
  | 'L1-C'
  | 'L2-B'
  | 'L2-B-DUAL'
  | 'L2-C'
  | 'L2PLUS-A'
  | 'L2PLUS-B'

export interface CerRecord {
  id: string
  label: string
  unitaMisura: 'mq' | 'km' | 'm' | 'KWh/a' | 'mc/s' | 'mc' | 'MW' | 'alunno'
  naturaCup?: NaturaCUP
  valoreUnitario: number
  metricaValore: string
  categoria: string
  tipologia: string
  driverFisico: string
  settore: string
  sottosettore: string
  tier: CerTier
  livello: string
  tipoCer: 'SINGLE_DRIVER' | 'DUAL_DRIVER'
  descrizione: string
  valoreMin: number
  valoreMedio: number
  valoreMax: number
  robustezza: RobustezzaLevel
  nProgetti: number
  durataMediaMesi: number
}

export interface AlternativaData {
  categoria: string
  tipologia: string
  quantita: number
  obiettivoCer?: number
  durataStimata?: number | null
  scenarioCostoScelto?: 'minimo' | 'medio' | 'massimo' | 'custom'
  motivazioneCostoCustom?: string
  capex: number
  opex: number
  nome: string
  clusterId?: string | null
  unitaMisura?: string
  robustezza?: RobustezzaLevel
  targetValues?: Record<string, number>
  /** Natura dell'alternativa — determina logica CAPEX/OPEX */
  naturaCup?: NaturaCUP
  /** Numero beneficiari/anno (solo per naturaCup='voucher') */
  nBeneficiari?: number
  /** Durata del programma in anni (solo voucher, default 5 — distinta dalla vita utile infrastrutturale) */
  vitaUtileProgram?: number
}

export interface ScoreComposito {
  alternativaId: AlternativaId
  alternativaNome: string
  cbaScore: number
  van: number
  bcr: number
  tir: number
  orizzonte: number
  tassoSconto: number
  impattoScore: number
  impattoAmbientale: number
  impattoSociale: number
  impattoTerritoriale: number
  rischioScore: number
  /** Aggregated sensitivity score: mean of the 7 stress-scenario composite scores (0–100) */
  sensitivityScore: number
  sensitivitaDetail?: {
    scenari: Array<{
      label: string
      score: number
    }>
  }
  scoreComposito: number
  mcaScore: number
  sensitivityMin: number
  sensitivityMax: number
  scoreFinale: number
  /** Estimated GDP contribution in €M (CAPEX × investment multiplier) */
  pil: number
  /** Estimated employment in job units */
  occupati: number
  /** Estimated production in €M (CAPEX + lifecycle OPEX) */
  produzione: number
  /** Estimated income (wage share) in €M */
  redditi: number
}

// ── Wizard state (global state across all 6 steps) ──

export interface WizardState {
  // Step 1
  selectedProjects: string[]
  progettoRiferimento: string | null
  // Step 2
  fabbisogni: {
    descrizione: string
    popolazione: number | null
    urgenza: UrgenzaIntervento | null
    urgenzaMotivazione: string
    strumentiPianificazione: string
    conseguenzeNonIntervento: string
    annoCostruzione: number | null
    classeSismica: ClasseSismica | null
    spazNonConformi: number | null
    opexSoglia: number | null
  }
  // Step 3
  opzioneZero: {
    statoOperativo: StatoOperativo
    capexManutenzione: number
    tassoDegrado: number
    kpiValues: Record<string, number>
    kpiMotivazioni: Record<string, string>
  }
  // Step 4
  mca: {
    koValues: Record<string, Record<string, string>>
    rankingValues: Record<string, Record<string, LivelloMCA>>
    pesoMcaRanking: number
  }
  // Step 5
  rischi: {
    grid: Record<string, Record<string, LivelloRischio>>
    mitigazioni: Record<string, string>
    mitigazioniSpecifiche: Record<string, Record<string, string>>
    pesoRischi: number
  }
  // Step 6
  anagrafica: {
    nome: string
    descrizione: string
    tag: string[]
  }
}
