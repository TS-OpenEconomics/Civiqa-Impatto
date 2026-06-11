import type { ScoreComposito } from '../types/docfap'
import { SENSITIVITY_SCENARIO_LABELS } from './sensitivita'

const ORIZZONTE = 20
const TASSO_SCONTO = 0.03
const BENEFIT_PER_POSTO = 5_500
const N_POSTI = 120
const ANNUAL_BENEFITS = N_POSTI * BENEFIT_PER_POSTO

function annuityFactor(r: number, n: number): number {
  return (1 - Math.pow(1 + r, -n)) / r
}

const AF = annuityFactor(TASSO_SCONTO, ORIZZONTE)

function calcVAN(capex: number, opex: number): number {
  return Math.round(ANNUAL_BENEFITS * AF - capex - opex * AF)
}

function calcBCR(capex: number, opex: number): number {
  const pvB = ANNUAL_BENEFITS * AF
  const pvC = capex + opex * AF
  if (pvC <= 0) return 0
  return Math.round((pvB / pvC) * 100) / 100
}

function calcTIR(capex: number, opex: number): number {
  if (capex <= 0) return 0
  const netAnnual = ANNUAL_BENEFITS - opex
  if (netAnnual <= 0) return 0
  let lo = 0
  let hi = 2.0
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2
    const pv = netAnnual * annuityFactor(mid, ORIZZONTE)
    if (pv > capex) lo = mid
    else hi = mid
    if (hi - lo < 1e-7) break
  }
  return Math.round(((lo + hi) / 2) * 1000) / 10
}

function calcEconPOC(capex: number, opex = 0): {
  pil: number; produzione: number; occupati: number; redditi: number
} {
  const activationBase = capex > 0 ? capex : opex
  const m = activationBase / 1_000_000
  return {
    pil: Math.round(m * 1.42 * 10) / 10,
    produzione: Math.round(m * 3.44 * 10) / 10,
    occupati: Math.round((activationBase / 100_000) * 0.78),
    redditi: Math.round(m * 1.38 * 10) / 10,
  }
}

function round1(v: number): number {
  return Math.round(v * 10) / 10
}

function meanArr(arr: readonly number[]): number {
  return round1(arr.reduce((s, v) => s + v, 0) / arr.length)
}

const ALT = {
  A1: { capex: 2_640_000, opex: 420_000 },
  A2: { capex: 1_440_000, opex: 310_000 },
  A3: { capex: 0, opex: 600_000 },
} as const

const CBA_SCORE = { A1: 42, A2: 100, A3: 40 } as const
const IMP_SCORE = { A1: 84, A2: 71, A3: 28 } as const
const IMP_SUB = {
  A1: { amb: 83, soc: 87, terr: 83 },
  A2: { amb: 68, soc: 75, terr: 70 },
  A3: { amb: 24, soc: 35, terr: 25 },
} as const
const RSK_SCORE = { A1: 51, A2: 74, A3: 56 } as const
const MCA_SCORE = { A1: 65, A2: 78, A3: 45 } as const
const W = { cba: 0.35, imp: 0.20, mca: 0.20, rsk: 0.15, sens: 0.10 } as const

const SENS = {
  A1: [54.5, 51.0, 60.5, 56.5, 58.0, 62.0, 52.5] as const,
  A2: [79.8, 79.0, 82.0, 81.2, 81.5, 83.0, 79.5] as const,
  A3: [46.5, 46.5, 46.5, 45.8, 47.2, 48.5, 44.2] as const,
} as const

function buildSensDetail(scores: readonly number[]) {
  return {
    scenari: SENSITIVITY_SCENARIO_LABELS.map((label, i) => ({
      label,
      score: round1(scores[i]),
    })),
  }
}

export function runPOCAnalysis(): ScoreComposito[] {
  const van = { A1: calcVAN(ALT.A1.capex, ALT.A1.opex), A2: calcVAN(ALT.A2.capex, ALT.A2.opex), A3: calcVAN(ALT.A3.capex, ALT.A3.opex) }
  const bcr = { A1: calcBCR(ALT.A1.capex, ALT.A1.opex), A2: calcBCR(ALT.A2.capex, ALT.A2.opex), A3: calcBCR(ALT.A3.capex, ALT.A3.opex) }
  const tir = { A1: calcTIR(ALT.A1.capex, ALT.A1.opex), A2: calcTIR(ALT.A2.capex, ALT.A2.opex), A3: calcTIR(ALT.A3.capex, ALT.A3.opex) }
  const eco = {
    A1: calcEconPOC(ALT.A1.capex, ALT.A1.opex),
    A2: calcEconPOC(ALT.A2.capex, ALT.A2.opex),
    A3: calcEconPOC(ALT.A3.capex, ALT.A3.opex),
  }
  const sens = {
    A1: meanArr(SENS.A1),
    A2: meanArr(SENS.A2),
    A3: meanArr(SENS.A3),
  }

  const comp = {
    A1: round1(CBA_SCORE.A1 * W.cba + IMP_SCORE.A1 * W.imp + MCA_SCORE.A1 * W.mca + RSK_SCORE.A1 * W.rsk + sens.A1 * W.sens),
    A2: round1(CBA_SCORE.A2 * W.cba + IMP_SCORE.A2 * W.imp + MCA_SCORE.A2 * W.mca + RSK_SCORE.A2 * W.rsk + sens.A2 * W.sens),
    A3: round1(CBA_SCORE.A3 * W.cba + IMP_SCORE.A3 * W.imp + MCA_SCORE.A3 * W.mca + RSK_SCORE.A3 * W.rsk + sens.A3 * W.sens),
  }

  return [
    {
      alternativaId: 'A2',
      alternativaNome: 'Ristrutturazione Asilo Nido',
      cbaScore: CBA_SCORE.A2,
      van: van.A2, bcr: bcr.A2, tir: tir.A2,
      orizzonte: ORIZZONTE, tassoSconto: TASSO_SCONTO,
      impattoScore: IMP_SCORE.A2,
      impattoAmbientale: IMP_SUB.A2.amb, impattoSociale: IMP_SUB.A2.soc, impattoTerritoriale: IMP_SUB.A2.terr,
      rischioScore: RSK_SCORE.A2,
      sensitivityScore: sens.A2, sensitivitaDetail: buildSensDetail(SENS.A2),
      scoreComposito: comp.A2, mcaScore: MCA_SCORE.A2,
      sensitivityMin: round1(Math.min(...SENS.A2)), sensitivityMax: round1(Math.max(...SENS.A2)),
      scoreFinale: comp.A2,
      ...eco.A2,
    },
    {
      alternativaId: 'A1',
      alternativaNome: 'Nuova Costruzione Asilo Nido',
      cbaScore: CBA_SCORE.A1,
      van: van.A1, bcr: bcr.A1, tir: tir.A1,
      orizzonte: ORIZZONTE, tassoSconto: TASSO_SCONTO,
      impattoScore: IMP_SCORE.A1,
      impattoAmbientale: IMP_SUB.A1.amb, impattoSociale: IMP_SUB.A1.soc, impattoTerritoriale: IMP_SUB.A1.terr,
      rischioScore: RSK_SCORE.A1,
      sensitivityScore: sens.A1, sensitivitaDetail: buildSensDetail(SENS.A1),
      scoreComposito: comp.A1, mcaScore: MCA_SCORE.A1,
      sensitivityMin: round1(Math.min(...SENS.A1)), sensitivityMax: round1(Math.max(...SENS.A1)),
      scoreFinale: comp.A1,
      ...eco.A1,
    },
    {
      alternativaId: 'A3',
      alternativaNome: 'Voucher Asilo Nido',
      cbaScore: CBA_SCORE.A3,
      van: van.A3, bcr: bcr.A3, tir: tir.A3,
      orizzonte: ORIZZONTE, tassoSconto: TASSO_SCONTO,
      impattoScore: IMP_SCORE.A3,
      impattoAmbientale: IMP_SUB.A3.amb, impattoSociale: IMP_SUB.A3.soc, impattoTerritoriale: IMP_SUB.A3.terr,
      rischioScore: RSK_SCORE.A3,
      sensitivityScore: sens.A3, sensitivitaDetail: buildSensDetail(SENS.A3),
      scoreComposito: comp.A3, mcaScore: MCA_SCORE.A3,
      sensitivityMin: round1(Math.min(...SENS.A3)), sensitivityMax: round1(Math.max(...SENS.A3)),
      scoreFinale: comp.A3,
      ...eco.A3,
    },
  ]
}
