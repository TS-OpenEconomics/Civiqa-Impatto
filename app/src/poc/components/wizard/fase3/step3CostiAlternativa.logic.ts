import type { CerRecord } from '../../../types/docfap'

export type ScenarioCosto = 'minimo' | 'medio' | 'massimo' | 'custom'

interface ComputeCostScenarioInput {
  cer: CerRecord | null
  obiettivo: number
  selectedScenario: ScenarioCosto
  currentCapex: number
  opexRatio: number
}

export interface CostScenarioSummary {
  hasCerData: boolean
  forcedCustomCapex: boolean
  capexMin: number
  capexMedio: number
  capexMax: number
  capexAttivo: number
  opexAutoValue: number
}

export function shouldShowCostEstimateSection(obiettivo: number): boolean {
  return obiettivo > 0
}

export function computeCostScenario({
  cer,
  obiettivo,
  selectedScenario,
  currentCapex,
  opexRatio,
}: ComputeCostScenarioInput): CostScenarioSummary {
  const hasCerData = Boolean(cer)
  const forcedCustomCapex = !hasCerData

  const capexMin = cer ? obiettivo * cer.valoreMin : 0
  const capexMedio = cer ? obiettivo * cer.valoreMedio : 0
  const capexMax = cer ? obiettivo * cer.valoreMax : 0

  let capexAttivo = currentCapex > 0 ? currentCapex : capexMedio
  if (hasCerData) {
    if (selectedScenario === 'minimo') capexAttivo = capexMin
    if (selectedScenario === 'medio') capexAttivo = capexMedio
    if (selectedScenario === 'massimo') capexAttivo = capexMax
    if (selectedScenario === 'custom') capexAttivo = currentCapex > 0 ? currentCapex : capexMedio
  }

  return {
    hasCerData,
    forcedCustomCapex,
    capexMin,
    capexMedio,
    capexMax,
    capexAttivo,
    opexAutoValue: Math.round(capexAttivo * opexRatio),
  }
}
