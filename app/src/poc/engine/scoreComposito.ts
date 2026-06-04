import { runPOCAnalysis } from './pocAnalysis'
import type { ScoreComposito } from '../types/docfap'

export const DEFAULT_DIMENSION_WEIGHTS = {
  wCBA: 60, wIMP: 5, wMCA: 20, wSENS: 15,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

interface ScoreInputs {
  cba: number
  impatto: number
  mca: number
  sensitivita: number
}

export function calcScoreComposito(
  scores: ScoreInputs,
  weights: typeof DEFAULT_DIMENSION_WEIGHTS,
  kRob: number,
): number {
  const total = weights.wCBA + weights.wIMP + weights.wMCA + weights.wSENS
  const norm = total > 0 ? total : 100

  const weighted =
    (weights.wCBA / norm) * clamp(scores.cba, 0, 100) +
    (weights.wIMP / norm) * clamp(scores.impatto, 0, 100) +
    (weights.wMCA / norm) * clamp(scores.mca, 0, 100) +
    (weights.wSENS / norm) * clamp(scores.sensitivita, 0, 100)

  return round1(weighted * clamp(kRob, 0, 1))
}

export function runFullAnalysis(): ScoreComposito[] {
  return runPOCAnalysis()
}
