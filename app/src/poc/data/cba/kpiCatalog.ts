import type { CbaKpiSection } from '../../contexts/ValutazioneWizardContext.js'

const BASE_KPI_SECTIONS: CbaKpiSection[] = [
  {
    id: 'ambientale',
    title: 'Risparmio ambientale (€)',
    rows: [
      {
        id: 'ambientale_rifiuti',
        section_id: 'ambientale',
        label: 'Maggiore qualità rifiuti differenziati',
        unit: 'currency',
        estimated_annual_value: 18000,
        editable: true,
      },
      {
        id: 'ambientale_fattore',
        section_id: 'ambientale',
        label: 'Fattore di Risparmio Ambientale',
        unit: 'currency',
        estimated_annual_value: 12000,
        editable: true,
      },
      {
        id: 'ambientale_deadweight',
        section_id: 'ambientale',
        label: 'Deadweight',
        unit: 'currency',
        estimated_annual_value: 8000,
        editable: true,
      },
      {
        id: 'ambientale_co2',
        section_id: 'ambientale',
        label: 'Prezzo della CO₂',
        unit: 'currency',
        estimated_annual_value: 45670,
        editable: true,
      },
    ],
  },
  {
    id: 'tariffa',
    title: 'Maggiore introito da TARI (€)',
    rows: [
      {
        id: 'tariffa_nuovi_paganti',
        section_id: 'tariffa',
        label: 'Numero di nuovi paganti',
        unit: 'currency',
        estimated_annual_value: 15000,
        editable: true,
      },
      {
        id: 'tariffa_deadweight',
        section_id: 'tariffa',
        label: 'Deadweight',
        unit: 'currency',
        estimated_annual_value: 12000,
        editable: true,
      },
      {
        id: 'tariffa_riduzione_evasione',
        section_id: 'tariffa',
        label: 'Riduzione evasione tariffaria',
        unit: 'currency',
        estimated_annual_value: 8000,
        editable: true,
      },
    ],
  },
]

export function getCbaKpiCatalog(): CbaKpiSection[] {
  return BASE_KPI_SECTIONS.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({ ...row })),
  }))
}
