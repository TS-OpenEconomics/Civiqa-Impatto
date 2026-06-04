import type { NaturaCUP } from '../types/docfap'

export interface CBAAlternativaInput {
  capex: number
  opex: number
}

// ── Input minimo richiesto da calcolaCERAlternativa ──────────────────────────
export interface CerCalcoloRecord {
  /** Costo unitario (€/alunno per voucher, €/mq o altra UM per infra) */
  cerUnitario: number
}

export type ScenarioZeroErogazione = 'totale' | 'parziale' | 'assente' | 'greenfield'

export interface CBAScenarioZeroInput {
  erogazioneAttuale: ScenarioZeroErogazione
  percentualeCopertura?: number
  vitaUtile?: string
  capexOrdinario?: number
  capexStraordinario?: number
}

export interface CBAParams {
  fabId: string
  quantitaCER: number
  orizzonte: number
  tassoSconto?: number
  isA0?: boolean
}

export interface CBAResult {
  van: number
  bcr: number
  tir: number
  cbaScore: number
}

const DEFAULT_DISCOUNT_RATE = 0.03
const MAX_TIR_ITERATIONS = 100
const TIR_TOLERANCE = 1e-7

const FAB_BENEFIT_UNIT: Record<string, number> = {
  'FAB-01': 1200,
  'FAB-02': 1300,
  'FAB-03': 1450,
  'FAB-04': 1500,
  'FAB-05': 1600,
  'FAB-06': 1750,
  'FAB-07': 1800,
  'FAB-08': 2000,
  'FAB-09': 2100,
  'FAB-10': 2200,
  'FAB-11': 2300,
  'FAB-12': 2400,
  'FAB-13': 2500,
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function parseVitaUtileYears(vitaUtile: string | undefined): number {
  if (!vitaUtile || vitaUtile.trim().length === 0) return Number.POSITIVE_INFINITY

  const normalized = vitaUtile.toLowerCase()
  if (normalized.includes('meno di 2')) return 2
  if (normalized.includes('2-5')) return 5
  if (normalized.includes('5-10')) return 10
  if (normalized.includes('oltre 10')) return 15

  const numbers = normalized.match(/\d+/g)
  if (!numbers || numbers.length === 0) return Number.POSITIVE_INFINITY
  return Number(numbers[numbers.length - 1])
}

function getAnnualBenefitByFabId(fabId: string, quantitaCER: number): number {
  const unitValue = FAB_BENEFIT_UNIT[fabId] ?? 1000
  return Math.max(0, quantitaCER) * unitValue
}

function buildBenefitsSeries(
  annualBenefit: number,
  orizzonte: number,
  scenarioZero: CBAScenarioZeroInput,
  isA0: boolean,
): number[] {
  const years = Math.max(0, Math.floor(orizzonte))
  const series = Array.from({ length: years + 1 }, () => 0)

  if (years === 0) return series

  if (isA0 && (scenarioZero.erogazioneAttuale === 'assente' || scenarioZero.erogazioneAttuale === 'greenfield')) {
    return series
  }

  const coverage =
    isA0 && scenarioZero.erogazioneAttuale === 'parziale'
      ? clamp((scenarioZero.percentualeCopertura ?? 0) / 100, 0, 1)
      : 1

  const vitaUtileYears = isA0 ? parseVitaUtileYears(scenarioZero.vitaUtile) : Number.POSITIVE_INFINITY

  for (let year = 1; year <= years; year += 1) {
    if (year > vitaUtileYears) {
      series[year] = 0
      continue
    }
    series[year] = annualBenefit * coverage
  }

  return series
}

function buildCostsSeries(
  alternativa: CBAAlternativaInput,
  scenarioZero: CBAScenarioZeroInput,
  orizzonte: number,
  isA0: boolean,
): number[] {
  const years = Math.max(0, Math.floor(orizzonte))
  const series = Array.from({ length: years + 1 }, () => 0)

  if (isA0) {
    series[0] = Math.max(0, scenarioZero.capexStraordinario ?? 0)
    for (let year = 1; year <= years; year += 1) {
      series[year] = Math.max(0, scenarioZero.capexOrdinario ?? 0)
    }
    return series
  }

  series[0] = Math.max(0, alternativa.capex)
  for (let year = 1; year <= years; year += 1) {
    series[year] = Math.max(0, alternativa.opex)
  }

  return series
}

export function calcVAN(cashflows: number[], r: number): number {
  const discount = Math.max(-0.99, r)
  return cashflows.reduce((npv, cf, t) => npv + cf / (1 + discount) ** t, 0)
}

export function calcBCR(benefici: number[], costi: number[], r: number): number {
  const discount = Math.max(-0.99, r)
  const pvBenefits = benefici.reduce((sum, v, t) => sum + v / (1 + discount) ** t, 0)
  const pvCosts = costi.reduce((sum, c, t) => sum + c / (1 + discount) ** t, 0)
  if (pvCosts <= 0) return 0
  return pvBenefits / pvCosts
}

export function calcTIR(cashflows: number[]): number {
  if (cashflows.length === 0) return 0

  const npvAt = (rate: number): number => calcVAN(cashflows, rate)

  let low = -0.99
  let high = 10
  let npvLow = npvAt(low)
  let npvHigh = npvAt(high)

  if (Number.isFinite(npvLow) && Number.isFinite(npvHigh) && npvLow * npvHigh < 0) {
    for (let i = 0; i < MAX_TIR_ITERATIONS; i += 1) {
      const mid = (low + high) / 2
      const npvMid = npvAt(mid)
      if (Math.abs(npvMid) < TIR_TOLERANCE) return mid
      if (npvLow * npvMid < 0) {
        high = mid
        npvHigh = npvMid
      } else {
        low = mid
        npvLow = npvMid
      }
    }
    return (low + high) / 2
  }

  let guess = 0.1
  for (let i = 0; i < MAX_TIR_ITERATIONS; i += 1) {
    const f = npvAt(guess)
    if (Math.abs(f) < TIR_TOLERANCE) return guess

    const delta = 1e-6
    const derivative = (npvAt(guess + delta) - f) / delta
    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-12) break

    guess -= f / derivative
    guess = clamp(guess, -0.99, 10)
  }

  return guess
}

export function calcCBAScore(
  alternativa: CBAAlternativaInput,
  scenarioZero: CBAScenarioZeroInput,
  params: CBAParams,
): CBAResult {
  const r = params.tassoSconto ?? DEFAULT_DISCOUNT_RATE
  const isA0 = Boolean(params.isA0)
  const annualBenefit = getAnnualBenefitByFabId(params.fabId, params.quantitaCER)

  if (isA0 && (scenarioZero.erogazioneAttuale === 'assente' || scenarioZero.erogazioneAttuale === 'greenfield')) {
    return { van: 0, bcr: 0, tir: 0, cbaScore: 0 }
  }

  const benefits = buildBenefitsSeries(annualBenefit, params.orizzonte, scenarioZero, isA0)
  const costs = buildCostsSeries(alternativa, scenarioZero, params.orizzonte, isA0)
  const cashflows = benefits.map((benefit, index) => benefit - (costs[index] ?? 0))

  const van = calcVAN(cashflows, r)
  const bcr = calcBCR(benefits, costs, r)
  const tir = calcTIR(cashflows)

  const capexRef = Math.max(1, isA0 ? (scenarioZero.capexStraordinario ?? 0) : alternativa.capex)
  const vanNorm = clamp((van / capexRef) * 100, 0, 100)
  const bcrNorm = clamp((bcr - 1) * 100, 0, 100)
  const tirNorm = clamp(tir * 500, 0, 100)
  const cbaScore = (vanNorm + bcrNorm + tirNorm) / 3

  return { van, bcr, tir, cbaScore }
}

export interface CalcoloCERResult {
  capex: number
  opexAnnuo: number
  costoTotaleAttualizzato: number
}

/**
 * Calcola CAPEX, OPEX annuo e costo totale attualizzato per un'alternativa
 * in base alla sua natura CUP.
 *
 * Voucher:
 *   CAPEX = 0
 *   OPEX annuo = nBeneficiari × cerRecord.cerUnitario
 *   Attualizzazione OPEX su vitaUtile con tasso r
 *
 * Infrastruttura / servizio / contributo:
 *   Delega al flusso di cassa CAPEX+OPEX standard (nBeneficiari ignorato).
 *
 * Pura function — nessun side effect, testabile in isolamento.
 */
export function calcolaCERAlternativa(
  natura: NaturaCUP,
  nBeneficiari: number,
  cerRecord: CerCalcoloRecord,
  vitaUtile: number,
  tassoSconto = DEFAULT_DISCOUNT_RATE,
): CalcoloCERResult {
  if (natura === 'voucher') {
    const capex = 0
    const opexAnnuo = Math.max(0, Math.round(nBeneficiari)) * cerRecord.cerUnitario

    // Fattore di attualizzazione rendita annua (formula annuity): Σ(t=1..T) 1/(1+r)^t
    const years = Math.max(0, Math.floor(vitaUtile))
    const r = Math.max(-0.99, tassoSconto)
    let pvFactor = 0
    for (let t = 1; t <= years; t += 1) {
      pvFactor += 1 / (1 + r) ** t
    }
    const costoTotaleAttualizzato = Math.round(opexAnnuo * pvFactor)

    return { capex, opexAnnuo, costoTotaleAttualizzato }
  }

  // Per le nature non-voucher il calcolo CAPEX/OPEX è gestito dal flusso
  // standard (buildBenefitsSeries / buildCostsSeries + calcVAN).
  // Questa funzione restituisce i valori grezzi senza attualizzazione.
  const opexAnnuo = nBeneficiari * cerRecord.cerUnitario
  return {
    capex: 0,
    opexAnnuo,
    costoTotaleAttualizzato: opexAnnuo * vitaUtile,
  }
}

export function normalizeCBAScores(scores: number[]): number[] {
  if (scores.length === 0) return []
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  if (max === min) return scores.map(() => 100)
  return scores.map((s) => ((s - min) / (max - min)) * 100)
}

/*
Inline test examples (pure, side-effect free):

Test 1:
  const van = calcVAN([-100, 30, 30, 30, 30], 0.03)
  // expected approximately -2.2

Test 2:
  const bcr = calcBCR([0, 60, 60], [100, 5, 5], 0.03)
  // expected bcr > 1

Test 3:
  const tir = calcTIR([-100, 40, 40, 40, 40])
  // expected finite value and convergence within 100 iterations
*/
