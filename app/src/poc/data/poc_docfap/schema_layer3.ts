// OpenCore Layer 3 — TypeScript interfaces

export type InterventionType =
  | 'nuova_realizzazione'
  | 'ristrutturazione'
  | 'ristrutturazione_efficientamento'
  | 'manutenzione_straordinaria_ee'
  | 'manutenzione_ordinaria'
  | 'restauro'
  | 'recupero'
  | 'ampliamento_potenziamento'
  | 'ammodernamento_tecnologico'
  | 'demolizione'
  | 'lavori_socialmente_utili'
  | 'altro'

export interface CategoryKpiLink {
  kpi_id: string
  is_negative_externality: boolean
  benefit_pct_override: number | null
  activation_question_ids: string[]
}

export interface CategoryCpLink {
  cp_id: string
  cf_code: string
}

export interface CategoryTipologiaLink {
  tipologia_code: InterventionType
  applicable: boolean
  benefit_pct_override: number | null
}

export interface CategoryNaceLink {
  nace_code: string
  pct_sector: number
}

export interface DiscountRate {
  pct_med: number
  pct_min: number
  pct_max: number
}

export interface ConstructionDuration {
  tipologia_code: InterventionType
  duration_months: number
}

export interface UsefulLifeByType {
  tipologia_code: InterventionType
  years: number
}

export interface OpexRange {
  pct_min: number
  pct_med: number
  pct_max: number
}

export interface InterventionCategory {
  code: string
  label: string
  subsector_code: string
  sector_code: string
  cluster_id: string
  kpi_links: CategoryKpiLink[]
  cp_links: CategoryCpLink[]
  context_question_ids: string[]
  tipologie_links: CategoryTipologiaLink[]
  fabbisogno_codes: string[]
  target_codes: string[]
  nace_links: CategoryNaceLink[]
  discount_rate: DiscountRate
  construction_durations: ConstructionDuration[]
  useful_life: UsefulLifeByType[]
  opex: OpexRange
}
