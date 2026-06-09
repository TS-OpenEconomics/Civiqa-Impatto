/**
 * riskMonteCarlo.ts — Mock Monte Carlo results for POC risk analysis
 *
 * Methodology (simplified POC simulation):
 *   For each of N=1000 iterations:
 *     1. Draw CAPEX ~ Lognormal(μ_capex, σ=0.20)
 *        Draw OPEX  ~ Lognormal(μ_opex,  σ=0.15)
 *        Draw Benefits ~ Normal(μ_ben,   σ=0.25·μ_ben)
 *     2. Compute NPV, IRR, BCR for each alternative
 *     3. Compute composite score with fixed weights
 *     4. Rank alternatives → record who ranks first
 *
 *   probBest = fraction of simulations where alternative ranked 1st
 *
 * Base values (from pocAnalysis.ts):
 *   A1: capex=2640000, opex=420000  → npv_base ≈ 930k
 *   A2: capex=1440000, opex=310000  → npv_base ≈ 3767k
 *   A3: capex=0,       opex=600000  → npv_base ≈ 893k
 *   annuityFactor(0.03, 20) = 14.877
 *   annualBenefits = 660000
 */

export interface SpiderPoint {
  param: string
  value: number
}

export interface HistogramBin {
  /** Display label for X axis */
  binLabel: string
  /** Bin lower bound in k€ */
  binMin: number
  /** Bin upper bound in k€ */
  binMax: number
  /** Simulation count in this bin */
  count: number
  /** True if binMin >= 0 (used for green/red colouring) */
  positive: boolean
}

export interface MCSummary {
  /** Mean NPV across simulations (k€) */
  mean: number
  /** Standard deviation (k€) */
  std: number
  /** 5th percentile NPV (k€) */
  p5: number
  /** 50th percentile NPV (k€) */
  p50: number
  /** 95th percentile NPV (k€) */
  p95: number
  /** Fraction of simulations with NPV < 0 */
  probNegative: number
  /** Fraction of simulations where this alternative ranked 1st overall */
  probBest: number
  nSimulations: number
}

export interface MCData {
  summary: MCSummary
  /** Absolute NPV elasticity |ε| per parameter — how much NPV changes per 1% param change */
  elasticities: SpiderPoint[]
  /** Normalised [0,1] variance of each parameter from MC */
  variances: SpiderPoint[]
  histogram: HistogramBin[]
}

// ── Heatmap ──────────────────────────────────────────────────────────────────

export const HEATMAP_COST_MULTS   = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] as const
export const HEATMAP_BENEFIT_MULTS = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] as const

export interface HeatmapCell {
  costMult: number
  benefitMult: number
  /** NPV in k€ */
  npv: number
}

const AF = 14.877
const ANNUAL_BENEFITS = 660_000

/**
 * Compute NPV for every combination of cost × benefit multipliers.
 * NPV(cm, bm) = ANNUAL_BENEFITS × bm × AF − cm × (capex + opex × AF)
 */
export function computeHeatmapCells(capex: number, opex: number): HeatmapCell[] {
  const baseCosts = capex + opex * AF
  return [...HEATMAP_COST_MULTS].flatMap(cm =>
    [...HEATMAP_BENEFIT_MULTS].map(bm => ({
      costMult: cm,
      benefitMult: bm,
      npv: Math.round((ANNUAL_BENEFITS * bm * AF - cm * baseCosts) / 1000),
    })),
  )
}

// ── Mock data ─────────────────────────────────────────────────────────────────

function bin(min: number, max: number, count: number): HistogramBin {
  // Etichetta in M€ (i valori interni restano in k€)
  const label = `${(min / 1000).toLocaleString('it-IT', { maximumFractionDigits: 1 })} M€`
  return { binLabel: label, binMin: min, binMax: max, count, positive: min >= 0 }
}

export const MC_MOCK_DATA: Record<string, MCData> = {
  // ── A1: Nuova costruzione — high capex, moderate NPV, volatile ─────────────
  A1: {
    summary: {
      mean: 940, std: 2100,
      p5: -2700, p50: 920, p95: 4650,
      probNegative: 0.33,
      probBest: 0.21,
      nSimulations: 1000,
    },
    elasticities: [
      { param: 'Benefici',     value: 10.6 },
      { param: 'OPEX',         value: 6.7  },
      { param: 'CAPEX',        value: 2.8  },
      { param: 'Tasso sconto', value: 3.5  },
    ],
    variances: [
      { param: 'Benefici',     value: 0.75 },
      { param: 'OPEX',         value: 0.25 },
      { param: 'CAPEX',        value: 0.30 },
      { param: 'Tasso sconto', value: 0.15 },
    ],
    histogram: [
      bin(-5500, -5000,  3), bin(-5000, -4500,  5), bin(-4500, -4000,  9),
      bin(-4000, -3500, 14), bin(-3500, -3000, 21), bin(-3000, -2500, 31),
      bin(-2500, -2000, 42), bin(-2000, -1500, 52), bin(-1500, -1000, 60),
      bin(-1000,  -500, 64), bin( -500,     0, 64),
      bin(    0,   500, 74), bin(  500,  1000, 83), bin( 1000,  1500, 89),
      bin( 1500,  2000, 88), bin( 2000,  2500, 81), bin( 2500,  3000, 70),
      bin( 3000,  3500, 57), bin( 3500,  4000, 43), bin( 4000,  4500, 30),
      bin( 4500,  5000, 19), bin( 5000,  5500, 11),
    ],
  },

  // ── A2: Ristrutturazione — best performer, low variance, rarely loses ──────
  A2: {
    summary: {
      mean: 3800, std: 1400,
      p5: 1050, p50: 3750, p95: 6300,
      probNegative: 0.015,
      probBest: 0.76,
      nSimulations: 1000,
    },
    elasticities: [
      { param: 'Benefici',     value: 2.6 },
      { param: 'OPEX',         value: 1.2 },
      { param: 'CAPEX',        value: 0.4 },
      { param: 'Tasso sconto', value: 0.8 },
    ],
    variances: [
      { param: 'Benefici',     value: 0.75 },
      { param: 'OPEX',         value: 0.25 },
      { param: 'CAPEX',        value: 0.20 },
      { param: 'Tasso sconto', value: 0.15 },
    ],
    histogram: [
      bin(  -500,     0,   6),
      bin(     0,   500,  16), bin(   500,  1000,  38), bin(  1000,  1500,  64),
      bin(  1500,  2000,  95), bin(  2000,  2500, 128), bin(  2500,  3000, 150),
      bin(  3000,  3500, 162), bin(  3500,  4000, 152), bin(  4000,  4500, 127),
      bin(  4500,  5000,  95), bin(  5000,  5500,  66), bin(  5500,  6000,  41),
      bin(  6000,  6500,  23), bin(  6500,  7000,  12), bin(  7000,  7500,   5),
    ],
  },

  // ── A3: Voucher — zero CAPEX, high OPEX sensitivity, volatile ─────────────
  A3: {
    summary: {
      mean: 890, std: 1950,
      p5: -2400, p50: 870, p95: 4400,
      probNegative: 0.32,
      probBest: 0.03,
      nSimulations: 1000,
    },
    elasticities: [
      { param: 'Benefici',     value: 11.0 },
      { param: 'OPEX',         value: 10.0 },
      { param: 'CAPEX',        value: 0.0  },   // capex = 0 → zero elasticity
      { param: 'Tasso sconto', value: 4.5  },
    ],
    variances: [
      { param: 'Benefici',     value: 0.75 },
      { param: 'OPEX',         value: 0.35 },
      { param: 'CAPEX',        value: 0.00 },   // no capex risk
      { param: 'Tasso sconto', value: 0.15 },
    ],
    histogram: [
      bin(-4500, -4000,  5), bin(-4000, -3500,  9), bin(-3500, -3000, 15),
      bin(-3000, -2500, 23), bin(-2500, -2000, 32), bin(-2000, -1500, 43),
      bin(-1500, -1000, 53), bin(-1000,  -500, 60), bin( -500,     0, 62),
      bin(     0,   500, 71), bin(   500,  1000, 81), bin(  1000,  1500, 88),
      bin(  1500,  2000, 87), bin(  2000,  2500, 79), bin(  2500,  3000, 67),
      bin(  3000,  3500, 53), bin(  3500,  4000, 40), bin(  4000,  4500, 27),
      bin(  4500,  5000, 17), bin(  5000,  5500, 10), bin(  5500,  6000,  5),
    ],
  },
}
