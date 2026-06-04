export interface McaRow {
  cat_code: string
  cat_label: string
  cluster_id: string
  cluster_label: string
  question_category: string
  question_code: string
  question_label: string
  question_text: string
  scale_or_logic: string
}

export interface SzRow {
  fab_code: string
  fab_label: string
  question_id: string
  question_order: string
  question_text: string
  question_type: string // "checkbox" | "radio"
  answer_code: string
  answer_label: string
  answer_text_fragment: string
}

export interface CapexRow {
  cat_code: string
  cat_label: string
  subsector_code: string
  cluster_id: string
  fab_codes: string
  source_type: string
  source_id: string
  source_label: string
  ip_code: string
  ip_label: string
  ip_udm: string
  ip_wizard_text: string
  ip_source_ref: string
  cf_code: string
  cf_udm: string
  cf_val_min: string
  cf_val_med: string
  cf_val_max: string
  opex_pct_min: string
  opex_pct_med: string
  opex_pct_max: string
  durata_nuova_mesi: string
  durata_ristrutt_mesi: string
  vita_utile_nuova_anni: string
  vita_utile_ristrutt_anni: string
}
