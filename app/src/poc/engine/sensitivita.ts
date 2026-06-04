export interface SensitivitaAlternativaInput {
  capex: number
  opex: number
}

export type KRobValue = 1 | 0.92 | 0.82

export const SENSITIVITY_SCENARIO_LABELS = [
  'CAPEX +10%',
  'CAPEX +20%',
  'CAPEX -10%',
  'Tasso sconto +0.5%',
  'Tasso sconto -0.5%',
  'Benefici +15%',
  'Benefici -15%',
] as const

type SensitivityScenarioLabel = (typeof SENSITIVITY_SCENARIO_LABELS)[number]

const SCENARIO_VARIATIONS: ReadonlyArray<{
  label: SensitivityScenarioLabel
  kind: 'capex' | 'discount' | 'benefit'
  variation: number
}> = [
  { label: 'CAPEX +10%', kind: 'capex', variation: 0.1 },
  { label: 'CAPEX +20%', kind: 'capex', variation: 0.2 },
  { label: 'CAPEX -10%', kind: 'capex', variation: -0.1 },
  { label: 'Tasso sconto +0.5%', kind: 'discount', variation: 0.005 },
  { label: 'Tasso sconto -0.5%', kind: 'discount', variation: -0.005 },
  { label: 'Benefici +15%', kind: 'benefit', variation: 0.15 },
  { label: 'Benefici -15%', kind: 'benefit', variation: -0.15 },
] as const

export interface SensitivityScenarioScore {
  label: SensitivityScenarioLabel
  score: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function simulateSensitivityScores(
  baseScore: number,
  alternativa: SensitivitaAlternativaInput,
): number[] {
  return simulateSensitivityScenarioScores(baseScore, alternativa).map((scenario) => scenario.score)
}

export function simulateSensitivityScenarioScores(
  baseScore: number,
  alternativa: SensitivitaAlternativaInput,
): SensitivityScenarioScore[] {
  const safeBase = clamp(baseScore, 0, 100)
  const capex = Math.max(0, alternativa.capex)
  const opex = Math.max(0, alternativa.opex)
  const economicExposure = capex / Math.max(1, capex + opex * 10)
  const capexSensitivity = clamp(0.45 * economicExposure, 0.12, 0.8)
  const discountSensitivity = clamp(8 * (0.8 + economicExposure * 0.2), 3.8, 10.8)
  const benefitSensitivity = clamp(0.35 * (2 - economicExposure), 0.25, 0.95)

  return SCENARIO_VARIATIONS.map((scenario) => {
    let score = safeBase

    if (scenario.kind === 'capex') {
      score = safeBase * (1 - scenario.variation * capexSensitivity)
    } else if (scenario.kind === 'discount') {
      score = safeBase * (1 - scenario.variation * discountSensitivity)
    } else {
      score = safeBase * (1 + scenario.variation * benefitSensitivity)
    }

    return {
      label: scenario.label,
      score: clamp(score, 0, 100),
    }
  })
}

function classifyKRob(maxAbsVariation: number): KRobValue {
  if (maxAbsVariation < 5) return 1
  if (maxAbsVariation <= 15) return 0.92
  return 0.82
}

export function calcKRob(
  baseScore: number,
  alternativa: SensitivitaAlternativaInput,
): KRobValue {
  const stressedScores = simulateSensitivityScores(baseScore, alternativa)
  const maxAbsVariation = stressedScores.reduce((acc, score) => {
    const variation = Math.abs(score - baseScore)
    return Math.max(acc, variation)
  }, 0)

  return classifyKRob(maxAbsVariation)
}
