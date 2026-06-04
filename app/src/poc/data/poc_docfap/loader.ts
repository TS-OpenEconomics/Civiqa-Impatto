import Papa from 'papaparse'
import mcaUrl from './poc_domande_mca.csv?url'
import szUrl from './poc_domande_sz.csv?url'
import capexUrl from './poc_capex_validation.csv?url'
import type { McaRow, SzRow, CapexRow } from './types'

// ---------------------------------------------------------------------------
// Singleton load promise — ensures CSVs are fetched at most once
// ---------------------------------------------------------------------------

let _loadPromise: Promise<void> | null = null

let _mcaRows: McaRow[] = []
let _szRows: SzRow[] = []
let _capexRows: CapexRow[] = []

function parseCsv<T>(url: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    })
  })
}

/**
 * Lazily loads all three POC CSVs. Idempotent — safe to call multiple times.
 */
export function loadPocData(): Promise<void> {
  if (_loadPromise !== null) return _loadPromise

  _loadPromise = Promise.all([
    parseCsv<McaRow>(mcaUrl),
    parseCsv<SzRow>(szUrl),
    parseCsv<CapexRow>(capexUrl),
  ]).then(([mca, sz, capex]) => {
    _mcaRows = mca
    _szRows = sz
    _capexRows = capex
  }).catch((err: unknown) => {
    _loadPromise = null  // allow retry
    throw err
  })

  return _loadPromise
}

// ---------------------------------------------------------------------------
// MCA index (built lazily)
// ---------------------------------------------------------------------------

// Map: qCode → McaQuestion (D1–D4 are deduplicated; D5/D6 keyed by "qCode|clusterId")
let _mcaIndexBuilt = false

// All unique fixed questions (D1–D4), deduplicated by question_code
const _fixedQuestions = new Map<string, McaQuestion>()

// Adaptive questions (D5/D6), keyed by cluster_id → McaQuestion[]
const _adaptiveByCluster = new Map<string, McaQuestion[]>()

export interface McaQuestion {
  qCode: string        // "D1"–"D6"
  label: string        // question_label
  text: string         // question_text
  isFixed: boolean     // true for D1–D4
  clusterIds: string[] // cluster_id values this question applies to
  scaleOrLogic: string // scale_or_logic field from CSV
}

const FIXED_CODES = new Set(['D1', 'D2', 'D3', 'D4'])

function buildMcaIndex(): void {
  if (_mcaIndexBuilt) return
  if (_mcaRows.length === 0) return  // don't poison the cache

  // Temporary map for adaptive: "qCode|clusterId" → row
  const adaptiveTemp = new Map<string, McaRow>()

  for (const row of _mcaRows) {
    const code = row.question_code.trim()

    if (FIXED_CODES.has(code)) {
      if (!_fixedQuestions.has(code)) {
        _fixedQuestions.set(code, {
          qCode: code,
          label: row.question_label,
          text: row.question_text,
          isFixed: true,
          clusterIds: [],
          scaleOrLogic: row.scale_or_logic,
        })
      }
    } else {
      // D5 or D6 — adaptive per cluster; strip cluster suffix to get bare qCode
      const qCode = code.replace(/^(D\d+)-.*$/, '$1')  // "D5-C07" → "D5"
      const key = `${qCode}|${row.cluster_id}`
      if (!adaptiveTemp.has(key)) {
        adaptiveTemp.set(key, row)
      }
    }
  }

  // Build _adaptiveByCluster from adaptiveTemp
  for (const [, row] of adaptiveTemp) {
    const code = row.question_code.trim()
    const qCode = code.replace(/^(D\d+)-.*$/, '$1')  // "D5-C07" → "D5"
    const clusterId = row.cluster_id

    let existing = _adaptiveByCluster.get(clusterId)
    if (existing === undefined) {
      existing = []
      _adaptiveByCluster.set(clusterId, existing)
    }

    const alreadyAdded = existing.some((q) => q.qCode === qCode)
    if (!alreadyAdded) {
      existing.push({
        qCode,
        label: row.question_label,
        text: row.question_text,
        isFixed: false,
        clusterIds: [clusterId],
        scaleOrLogic: row.scale_or_logic,
      })
    }
  }

  _mcaIndexBuilt = true
}

/**
 * Returns D1–D4 (deduplicated, isFixed=true) plus D5/D6 filtered by the
 * provided clusterIds. Maximum 6 questions total.
 */
export function getMatrixQuestions(clusterIds: string[]): McaQuestion[] {
  buildMcaIndex()

  const fixed = Array.from(_fixedQuestions.values())

  const seenAdaptiveCodes = new Set<string>()
  const adaptive: McaQuestion[] = []

  for (const clusterId of clusterIds) {
    const questions = _adaptiveByCluster.get(clusterId) ?? []
    for (const q of questions) {
      if (!seenAdaptiveCodes.has(q.qCode)) {
        seenAdaptiveCodes.add(q.qCode)
        adaptive.push({ ...q, clusterIds: [clusterId] })
      } else {
        // Merge clusterIds for same adaptive question appearing in multiple clusters
        const idx = adaptive.findIndex((a) => a.qCode === q.qCode)
        if (idx !== -1) {
          if (!adaptive[idx].clusterIds.includes(clusterId)) {
            adaptive[idx] = { ...adaptive[idx], clusterIds: [...adaptive[idx].clusterIds, clusterId] }
          }
        }
      }
    }
  }

  return [...fixed, ...adaptive].slice(0, 6)
}

// ---------------------------------------------------------------------------
// SZ index (built lazily)
// ---------------------------------------------------------------------------

let _szIndexBuilt = false

// Map: fab_code → SzQuestion[]
const _szByFab = new Map<string, SzQuestion[]>()

export interface SzQuestion {
  questionId: string
  order: number
  text: string
  tipo: 'checkbox' | 'radio'
  opzioni: Array<{ id: string; label: string; textFragment: string }>
}

function buildSzIndex(): void {
  if (_szIndexBuilt) return
  if (_szRows.length === 0) return  // don't poison the cache

  // Intermediate: group rows by fab_code → question_id → SzQuestion (partial)
  type QuestionAccum = {
    questionId: string
    order: number
    text: string
    tipo: 'checkbox' | 'radio'
    opzioni: Array<{ id: string; label: string; textFragment: string }>
  }

  const fabMap = new Map<string, Map<string, QuestionAccum>>()

  for (const row of _szRows) {
    const fabCode = row.fab_code.trim()
    const questionId = row.question_id.trim()
    const tipo = row.question_type.trim() === 'checkbox' ? 'checkbox' : 'radio'

    if (!fabMap.has(fabCode)) {
      fabMap.set(fabCode, new Map())
    }
    const questionMap = fabMap.get(fabCode)!

    if (!questionMap.has(questionId)) {
      questionMap.set(questionId, {
        questionId,
        order: parseInt(row.question_order, 10) || 0,
        text: row.question_text,
        tipo,
        opzioni: [],
      })
    }

    const q = questionMap.get(questionId)!
    q.opzioni.push({
      id: row.answer_code.trim(),
      label: row.answer_label,
      textFragment: row.answer_text_fragment,
    })
  }

  for (const [fabCode, questionMap] of fabMap) {
    const questions = Array.from(questionMap.values()).sort(
      (a, b) => a.order - b.order,
    )
    _szByFab.set(fabCode, questions)
  }

  _szIndexBuilt = true
}

/**
 * Returns all SZ questions for the given FAB id, sorted by order.
 */
export function getSzQuestionsForFab(fabId: string): SzQuestion[] {
  buildSzIndex()
  return _szByFab.get(fabId) ?? []
}

// ---------------------------------------------------------------------------
// Capex index (built lazily)
// ---------------------------------------------------------------------------

let _capexIndexBuilt = false

// Map: cluster_id → CapexParam[]
const _capexByCluster = new Map<string, CapexParam[]>()

export interface CapexParam {
  catCode: string
  catLabel: string
  clusterId: string
  ipCode: string
  ipLabel: string
  ipUdm: string
  ipWizardText: string
  cfCode: string
  cfUdm: string
  cfValMin: number
  cfValMed: number
  cfValMax: number
  opexPctMin: number
  opexPctMed: number
  opexPctMax: number
  durataNuovaMesi: number
  durataRistruttMesi: number
  vitaUtileNuovaAnni: number
  vitaUtileRistruttAnni: number
}

function parseNum(value: string): number {
  const n = parseFloat(value)
  return isNaN(n) ? 0 : n
}

function buildCapexIndex(): void {
  if (_capexIndexBuilt) return
  if (_capexRows.length === 0) return  // don't poison the cache

  for (const row of _capexRows) {
    const clusterId = row.cluster_id.trim()

    const param: CapexParam = {
      catCode: row.cat_code.trim(),
      catLabel: row.cat_label,
      clusterId,
      ipCode: row.ip_code.trim(),
      ipLabel: row.ip_label,
      ipUdm: row.ip_udm,
      ipWizardText: row.ip_wizard_text,
      cfCode: row.cf_code.trim(),
      cfUdm: row.cf_udm,
      cfValMin: parseNum(row.cf_val_min),
      cfValMed: parseNum(row.cf_val_med),
      cfValMax: parseNum(row.cf_val_max),
      opexPctMin: parseNum(row.opex_pct_min),
      opexPctMed: parseNum(row.opex_pct_med),
      opexPctMax: parseNum(row.opex_pct_max),
      durataNuovaMesi: parseNum(row.durata_nuova_mesi),
      durataRistruttMesi: parseNum(row.durata_ristrutt_mesi),
      vitaUtileNuovaAnni: parseNum(row.vita_utile_nuova_anni),
      vitaUtileRistruttAnni: parseNum(row.vita_utile_ristrutt_anni),
    }

    let existing = _capexByCluster.get(clusterId)
    if (existing === undefined) {
      existing = []
      _capexByCluster.set(clusterId, existing)
    }
    existing.push(param)
  }

  _capexIndexBuilt = true
}

/**
 * Returns all capex parameters for the given cluster_id.
 */
export function getCapexParamsForCluster(clusterId: string): CapexParam[] {
  buildCapexIndex()
  return _capexByCluster.get(clusterId) ?? []
}
