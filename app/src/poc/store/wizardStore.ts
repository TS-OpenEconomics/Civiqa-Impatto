import type {
  AlternativaData,
  AlternativaId,
  ScoreComposito,
} from '../types/docfap'

type ValutazioneLivello = 'alto' | 'medio' | 'basso' | 'nullo'

interface RupData {
  nome: string
  qualifica: string
  email: string
}

interface InterventoData {
  denominazione: string
  cup?: string
  fonteFinanziamento?: string
}

interface ProblemaData {
  descrizione: string
  soddisfatto: string
  documentato: string
  riferimentoAtto?: string
}

interface LocalizzazioneData {
  comune: string
  provincia: string
  regione: string
  zonaSismica?: string
  classificazioneArea?: string
  areaGeograficaCer?: string
}

interface DecisioneRUP {
  alternativaScelta: AlternativaId
  coerente: boolean
  motivazione: string
  passiSuccessivi: string
}

export interface WizardStoreState {
  currentStep: number
  completedSteps: number[]
  fabId: string | null
  clusterId: string | null
  temaId: string | null
  rup: RupData
  intervento: InterventoData
  problema: ProblemaData
  urgenza: string
  fattoriAggravamento: string[]
  scenarioZeroAnswers: Record<string, string | string[]>
  scenarioZeroNarrative: string
  q1Value: number | null
  mcaScores: Record<string, Record<string, string>>
  alternative: Record<AlternativaId, AlternativaData | null>
  localizzazione: LocalizzazioneData
  rischiScores: Record<AlternativaId, Record<string, ValutazioneLivello>>
  rischiNote: Record<AlternativaId, Record<string, string>>
  rischiMitigazioni: Record<string, string>
  riskScore: Record<AlternativaId, number>
  rischiAggiuntivi: string
  /** Alternative in ordine di definizione (esclude A0). Cresce dinamicamente. */
  alternativeDefinite: AlternativaId[]
  /** true quando il RUP ha risposto "No" all'ultima domanda "Aggiungi alternativa?" */
  alternativeAggiuntaCompletata: boolean
  scoreFinale: ScoreComposito[] | null
  decisioneRUP: DecisioneRUP | null
}

interface WizardStoreActions {
  setStep: (step: number) => void
  completeStep: (step: number) => void
  setFab: (fabId: string | null, temaId?: string | null) => void
  setCluster: (clusterId: string | null) => void
  setRup: (patch: Partial<RupData>) => void
  setIntervento: (patch: Partial<InterventoData>) => void
  setLocalizzazione: (patch: Partial<LocalizzazioneData>) => void
  setProblema: (patch: Partial<ProblemaData>) => void
  setUrgenza: (urgenza: string) => void
  setFattoriAggravamento: (fattori: string[]) => void
  setScenarioZeroAnswers: (answers: Record<string, string | string[]>) => void
  setScenarioZeroNarrative: (text: string) => void
  setQ1Value: (value: number | null) => void
  setMcaScores: (altId: string, qCode: string, scale: string) => void
  addAlternativa: (id: AlternativaId, alternativa: AlternativaData | null) => void
  setRischi: (id: AlternativaId, values: Record<string, ValutazioneLivello>) => void
  setRischioNota: (id: AlternativaId, fattoreId: string, nota: string) => void
  setRischioMitigazione: (fattoreId: string, mitigazione: string) => void
  setRiskScore: (id: AlternativaId, score: number) => void
  setRischiAggiuntivi: (value: string) => void
  setAlternativeDefinite: (ids: AlternativaId[]) => void
  setAlternativeAggiuntaCompletata: (value: boolean) => void
  setScore: (scoreFinale: ScoreComposito[] | null) => void
  setDecisione: (decisione: DecisioneRUP | null) => void
  reset: () => void
  prefillPOCAnswers: (clusterId: string, altIds: AlternativaId[]) => void
}

const STORAGE_KEY = 'civiqa.wizard.store.v2'
const FIRST_STEP = 0
const LAST_STEP = 5

const DEFAULT_WIZARD_STATE: WizardStoreState = {
  currentStep: 0,
  completedSteps: [],
  fabId: null,
  clusterId: null,
  temaId: null,
  rup: {
    nome: '',
    qualifica: '',
    email: '',
  },
  intervento: {
    denominazione: '',
    cup: '',
    fonteFinanziamento: '',
  },
  problema: {
    descrizione: '',
    soddisfatto: '',
    documentato: '',
    riferimentoAtto: '',
  },
  urgenza: '',
  fattoriAggravamento: [],
  scenarioZeroAnswers: {},
  scenarioZeroNarrative: '',
  q1Value: null,
  mcaScores: {},
  alternative: {
    A0: null,
    A1: null,
    A2: null,
    A3: null,
    A4: null,
    A5: null,
  },
  localizzazione: {
    comune: '',
    provincia: '',
    regione: '',
    zonaSismica: '',
    classificazioneArea: '',
    areaGeograficaCer: '',
  },
  rischiScores: {
    A0: {},
    A1: {},
    A2: {},
    A3: {},
    A4: {},
    A5: {},
  },
  rischiNote: {
    A0: {},
    A1: {},
    A2: {},
    A3: {},
    A4: {},
    A5: {},
  },
  rischiMitigazioni: {},
  riskScore: {
    A0: 0,
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    A5: 0,
  },
  rischiAggiuntivi: '',
  alternativeDefinite: ['A1'],
  alternativeAggiuntaCompletata: false,
  scoreFinale: null,
  decisioneRUP: null,
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function clampStep(step: number): number {
  return Math.min(LAST_STEP, Math.max(FIRST_STEP, step))
}

function parseStoredState(raw: string | null): WizardStoreState | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<WizardStoreState>
    return {
      ...DEFAULT_WIZARD_STATE,
      ...parsed,
      currentStep: clampStep(parsed.currentStep ?? DEFAULT_WIZARD_STATE.currentStep),
      completedSteps: parsed.completedSteps ?? DEFAULT_WIZARD_STATE.completedSteps,
      rup: { ...DEFAULT_WIZARD_STATE.rup, ...parsed.rup },
      intervento: { ...DEFAULT_WIZARD_STATE.intervento, ...parsed.intervento },
      problema: { ...DEFAULT_WIZARD_STATE.problema, ...parsed.problema },
      scenarioZeroAnswers: parsed.scenarioZeroAnswers ?? DEFAULT_WIZARD_STATE.scenarioZeroAnswers,
      scenarioZeroNarrative: parsed.scenarioZeroNarrative ?? DEFAULT_WIZARD_STATE.scenarioZeroNarrative,
      q1Value: parsed.q1Value ?? DEFAULT_WIZARD_STATE.q1Value,
      mcaScores: parsed.mcaScores ?? DEFAULT_WIZARD_STATE.mcaScores,
      alternative: { ...DEFAULT_WIZARD_STATE.alternative, ...parsed.alternative },
      localizzazione: { ...DEFAULT_WIZARD_STATE.localizzazione, ...parsed.localizzazione },
      rischiScores: { ...DEFAULT_WIZARD_STATE.rischiScores, ...parsed.rischiScores },
      rischiNote: { ...DEFAULT_WIZARD_STATE.rischiNote, ...parsed.rischiNote },
      rischiMitigazioni: {
        ...DEFAULT_WIZARD_STATE.rischiMitigazioni,
        ...parsed.rischiMitigazioni,
      },
      riskScore: { ...DEFAULT_WIZARD_STATE.riskScore, ...parsed.riskScore },
      rischiAggiuntivi: parsed.rischiAggiuntivi ?? DEFAULT_WIZARD_STATE.rischiAggiuntivi,
      // Migration: derive alternativeDefinite from existing alternative data when missing
      alternativeDefinite: parsed.alternativeDefinite ?? (() => {
        const ids: AlternativaId[] = ['A1']
        if (parsed.alternative?.A2) ids.push('A2')
        if (parsed.alternative?.A3) ids.push('A3')
        if (parsed.alternative?.A4) ids.push('A4')
        if (parsed.alternative?.A5) ids.push('A5')
        return ids
      })(),
      alternativeAggiuntaCompletata:
        parsed.alternativeAggiuntaCompletata ??
        DEFAULT_WIZARD_STATE.alternativeAggiuntaCompletata,
    }
  } catch {
    return null
  }
}

// Deep clone so the shared DEFAULT_WIZARD_STATE (with nested objects) is never
// mutated/aliased — guarantees reset() always yields a pristine state.
function freshState(): WizardStoreState {
  return structuredClone(DEFAULT_WIZARD_STATE)
}

function loadInitialState(): WizardStoreState {
  if (!isBrowser()) return freshState()
  const stateFromStorage = parseStoredState(window.sessionStorage.getItem(STORAGE_KEY))
  return stateFromStorage ?? freshState()
}

let currentState = loadInitialState()
const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

function persist(state: WizardStoreState): void {
  if (!isBrowser()) return
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function updateState(updater: (prev: WizardStoreState) => WizardStoreState): void {
  currentState = updater(currentState)
  persist(currentState)
  notify()
}

const actions: WizardStoreActions = {
  setStep(step) {
    updateState((prev) => ({ ...prev, currentStep: clampStep(step) }))
  },
  completeStep(step) {
    updateState((prev) => {
      if (prev.completedSteps.includes(step)) return prev
      const completedSteps = [...prev.completedSteps, step].sort((a, b) => a - b)
      return { ...prev, completedSteps }
    })
  },
  setFab(fabId, temaId) {
    updateState((prev) => ({ ...prev, fabId, temaId: temaId ?? prev.temaId }))
  },
  setCluster(clusterId) {
    updateState((prev) => ({ ...prev, clusterId }))
  },
  setRup(patch) {
    updateState((prev) => ({
      ...prev,
      rup: { ...prev.rup, ...patch },
    }))
  },
  setIntervento(patch) {
    updateState((prev) => ({
      ...prev,
      intervento: { ...prev.intervento, ...patch },
    }))
  },
  setLocalizzazione(patch) {
    updateState((prev) => ({
      ...prev,
      localizzazione: { ...prev.localizzazione, ...patch },
    }))
  },
  setProblema(patch) {
    updateState((prev) => ({
      ...prev,
      problema: { ...prev.problema, ...patch },
    }))
  },
  setUrgenza(urgenza) {
    updateState((prev) => ({ ...prev, urgenza }))
  },
  setFattoriAggravamento(fattori) {
    updateState((prev) => ({ ...prev, fattoriAggravamento: fattori }))
  },
  setScenarioZeroAnswers(answers) {
    updateState((prev) => ({ ...prev, scenarioZeroAnswers: answers }))
  },
  setScenarioZeroNarrative(text) {
    updateState((prev) => ({ ...prev, scenarioZeroNarrative: text }))
  },
  setQ1Value(value) {
    updateState((prev) => ({ ...prev, q1Value: value }))
  },
  setMcaScores(altId, qCode, scale) {
    updateState((prev) => ({
      ...prev,
      mcaScores: {
        ...prev.mcaScores,
        [altId]: {
          ...(prev.mcaScores[altId] ?? {}),
          [qCode]: scale,
        },
      },
    }))
  },
  addAlternativa(id, alternativa) {
    updateState((prev) => ({
      ...prev,
      alternative: {
        ...prev.alternative,
        [id]: alternativa,
      },
    }))
  },
  setRischi(id, values) {
    updateState((prev) => ({
      ...prev,
      rischiScores: {
        ...prev.rischiScores,
        [id]: values,
      },
    }))
  },
  setRischioNota(id, fattoreId, nota) {
    updateState((prev) => ({
      ...prev,
      rischiNote: {
        ...prev.rischiNote,
        [id]: {
          ...prev.rischiNote[id],
          [fattoreId]: nota,
        },
      },
    }))
  },
  setRischioMitigazione(fattoreId, mitigazione) {
    updateState((prev) => ({
      ...prev,
      rischiMitigazioni: {
        ...prev.rischiMitigazioni,
        [fattoreId]: mitigazione,
      },
    }))
  },
  setRiskScore(id, score) {
    updateState((prev) => ({
      ...prev,
      riskScore: {
        ...prev.riskScore,
        [id]: score,
      },
    }))
  },
  setRischiAggiuntivi(value) {
    updateState((prev) => ({ ...prev, rischiAggiuntivi: value }))
  },
  setAlternativeDefinite(ids) {
    updateState((prev) => ({ ...prev, alternativeDefinite: ids }))
  },
  setAlternativeAggiuntaCompletata(value) {
    updateState((prev) => ({ ...prev, alternativeAggiuntaCompletata: value }))
  },
  setScore(scoreFinale) {
    updateState((prev) => ({ ...prev, scoreFinale }))
  },
  setDecisione(decisione) {
    updateState((prev) => ({ ...prev, decisioneRUP: decisione }))
  },
  reset() {
    updateState(() => freshState())
  },

  prefillPOCAnswers(clusterId: string, altIds: AlternativaId[]) {
    if (clusterId !== 'C03') return

    const state = currentState

    const riskDefaults: Partial<Record<AlternativaId, Record<string, ValutazioneLivello>>> = {
      A1: {
        C03_R_01: 'alto',  C03_R_02: 'medio', C03_R_03: 'basso',
        C03_R_04: 'medio', C03_R_05: 'alto',  C03_R_06: 'medio',
      },
      A2: {
        C03_R_01: 'medio', C03_R_02: 'medio', C03_R_03: 'alto',
        C03_R_04: 'basso', C03_R_05: 'medio', C03_R_06: 'basso',
      },
      A3: {
        C03_R_01: 'basso', C03_R_02: 'basso', C03_R_03: 'basso',
        C03_R_04: 'medio', C03_R_05: 'basso', C03_R_06: 'basso',
      },
    }
    const newRischiScores = { ...state.rischiScores }
    for (const altId of altIds) {
      const defaults = riskDefaults[altId]
      if (!defaults) continue
      if (Object.keys(state.rischiScores[altId] ?? {}).length > 0) continue
      newRischiScores[altId] = { ...defaults }
    }

    updateState((prev) => ({
      ...prev,
      rischiScores: newRischiScores,
    }))
  },
}

export const wizardStore = {
  getState: (): WizardStoreState => currentState,
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  actions,
}
