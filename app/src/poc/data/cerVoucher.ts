/**
 * CER Voucher — tipologia distinta dai CER infrastrutturali OpenCoesione.
 *
 * AVVERTENZA METODOLOGICA:
 * - UM €/alunno è eterogenea rispetto a €/mq, €/ml ecc. — mai aggregare le due serie.
 * - CAPEX = 0 per definizione; il valore economicamente rilevante è l'OPEX annuo.
 * - Valore puntuale (no range P25/P75): flag "proxy_letteratura" obbligatorio in UI.
 * - La vita utile del programma è discrezionale (3-10 anni), non tecnica (25-30 anni infra).
 * - Fonte: MEF – Nota metodologica PNRR M4C1 + ISTAT Indagine asili nido 2023.
 */

export type FlagQualitaCer = 'proxy_letteratura' | 'opencoesione' | 'parametrico'

export interface CerVoucherRecord {
  id: string
  label: string
  /** Sempre 'voucher' — discriminante rispetto ai CerRecord infrastrutturali */
  naturaCup: 'voucher'
  categoriaCup: string
  /** €/alunno — unità eterogenea rispetto alle UM infrastrutturali */
  unitaMisura: 'alunno'
  /** Costo annuo per beneficiario (€/alunno/anno) */
  cerUnitario: number
  fonte: string
  /** 'proxy_letteratura' → mostrare in UI con tooltip sulla fonte */
  flagQualita: FlagQualitaCer
  note: string
  /** FAB a cui si applica questo CER voucher */
  fabCodes: string[]
  /** Etichette delle alternative a cui è applicabile */
  applicableAlternatives: string[]
}

/**
 * Voucher / contributo per servizio educativo 0-3 anni.
 * Calibrato su comuni medi Lazio, proxy MEF PNRR M4C1 + ISTAT 2023.
 * FAB applicabile: FAB-01 (Servizi per la prima infanzia 0-3 anni).
 */
export const CER_VOUCHER_EDU_0_3: CerVoucherRecord = {
  id: 'CER-VOUCHER-EDU-0-3',
  label: 'Voucher / contributo per servizio educativo 0-3 anni',
  naturaCup: 'voucher',
  categoriaCup: 'Istruzione - Servizi educativi per la prima infanzia',
  unitaMisura: 'alunno',
  cerUnitario: 5000,
  fonte: 'MEF – Nota metodologica PNRR M4C1 + ISTAT Indagine asili nido 2023',
  flagQualita: 'proxy_letteratura',
  note:
    'Costo annuo per alunno in struttura convenzionata o voucher diretto. ' +
    'Calibrato su comuni medi Lazio. ' +
    'Non aggregabile con CER infrastrutturali (UM eterogenea).',
  fabCodes: ['FAB-01'],
  applicableAlternatives: ['voucher_diretto', 'convenzione_privati', 'gestione_diretta_comunale'],
}

// ── Mock dati territoriali — Colleferro, Fabbisogno nido 0-3 anni ──────────

export interface FabbisognoNidoMock {
  id: string
  fabCode: string
  comune: string
  istatCode: string
  /** Stima ISTAT bambini residenti 0-3 anni */
  popolazione0_3: number
  /** Quota 0-1 di bambini con posto garantito (es. 0.20 = 20%) */
  tassoCoperturAttuale: number
  postiNidoEsistenti: number
  /** Bambini senza copertura = popolazione0_3 × (1 - tassoCoperturAttuale) − postiNidoEsistenti */
  gapStimato: number
  cerVoucher: {
    cerUnitario: number
    unitaMisura: 'alunno'
    fonte: string
  }
  descrizionProblema: string
  urgenza: 'Critica' | 'Alta' | 'Media' | 'Bassa'
  riferimentoPianificazione: string
}

/**
 * Colleferro — fabbisogno servizi educativi 0-3 anni.
 * Copertura attuale ~20%, sotto obiettivo europeo 33%.
 * Gap stimato: 178 bambini senza copertura garantita.
 */
export const FABBISOGNO_NIDO_0_3_COLLEFERRO: FabbisognoNidoMock = {
  id: 'FAB-COLLEFERRO-001',
  fabCode: 'FAB-01',
  comune: 'Colleferro',
  istatCode: '058027',
  popolazione0_3: 298,
  tassoCoperturAttuale: 0.20,
  postiNidoEsistenti: 60,
  gapStimato: 178,
  cerVoucher: {
    cerUnitario: 5000,
    unitaMisura: 'alunno',
    fonte: 'proxy_letteratura',
  },
  descrizionProblema:
    'Il Comune di Colleferro presenta una copertura dei servizi educativi per la prima ' +
    'infanzia (0-3 anni) inferiore all\'obiettivo europeo del 33%, con circa 60 posti ' +
    'disponibili a fronte di una platea stimata di 298 bambini residenti.',
  urgenza: 'Alta',
  riferimentoPianificazione:
    'PNRR M4C1 Investimento 1.1 — Piano di sviluppo sistema territoriale servizi ' +
    'educativi prima infanzia',
}

/** Helper: OPEX annuo voucher = n_beneficiari × cerUnitario */
export function calcOpexVoucher(nBeneficiari: number, cerUnitario = CER_VOUCHER_EDU_0_3.cerUnitario): number {
  return Math.max(0, Math.round(nBeneficiari)) * cerUnitario
}
