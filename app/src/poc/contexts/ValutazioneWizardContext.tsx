/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface ProjectLocation {
  id: string
  address: string
}

export interface CapexYearData {
  pct: string
  amount: string
}

export interface CapexLocationData {
  location_id: string
  total: string
  years: Record<number, CapexYearData>
}

export interface OpexLocationData {
  location_id: string
  manual_enabled: boolean
  auto_annual: string
  yearly_values: Record<number, string>
}

export interface CbaKpiRow {
  id: string
  section_id: string
  label: string
  unit: 'currency'
  estimated_annual_value: number
  editable: boolean
}

export interface CbaKpiSection {
  id: string
  title: string
  rows: CbaKpiRow[]
}

export interface CbaBenefitSeriesInput {
  kpi_id: string
  yearly_values: Record<number, number>
}

export interface ValutazioneWizardState {
  project_name: string
  cup_code: string
  project_description: string
  project_status: 'in_preparazione' | 'in_approvazione' | 'approvato' | ''
  sector_id: string | null
  sector_label: string
  subsector_id: string | null
  subsector_label: string
  category_id: string | null
  category_label: string
  intervention_type_id: string | null
  intervention_type_label: string
  start_date: string
  end_date: string
  locations: ProjectLocation[]
  target_quantity: number | null
  update_year: number
  capex_mode: 'file' | 'total' | null
  capex_file_error: boolean
  capex_data: CapexLocationData[]
  opex_data: OpexLocationData[]
  cba_kpi_years: number[]
  cba_kpi_rows: CbaKpiRow[]
  cba_kpi_distribution: Record<string, Record<number, string>>
  cba_kpi_last_mode: 'auto' | 'manual' | null
}

const defaultState: ValutazioneWizardState = {
  project_name: '',
  cup_code: '',
  project_description: '',
  project_status: '',
  sector_id: null,
  sector_label: '',
  subsector_id: null,
  subsector_label: '',
  category_id: null,
  category_label: '',
  intervention_type_id: null,
  intervention_type_label: '',
  start_date: '',
  end_date: '',
  locations: [],
  target_quantity: null,
  update_year: new Date().getFullYear() + 1,
  capex_mode: null,
  capex_file_error: false,
  capex_data: [],
  opex_data: [],
  cba_kpi_years: [],
  cba_kpi_rows: [],
  cba_kpi_distribution: {},
  cba_kpi_last_mode: null,
}

interface ValutazioneWizardContextType {
  state: ValutazioneWizardState
  setState: (updates: Partial<ValutazioneWizardState>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  reset: () => void
}

const ValutazioneWizardContext = createContext<ValutazioneWizardContextType | null>(null)

export function ValutazioneWizardProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<ValutazioneWizardState>(defaultState)
  const [currentStep, setCurrentStep] = useState(1)

  const setState = (updates: Partial<ValutazioneWizardState>) => {
    setStateRaw((previous) => ({ ...previous, ...updates }))
  }

  const reset = () => {
    setStateRaw(defaultState)
    setCurrentStep(1)
  }

  return (
    <ValutazioneWizardContext.Provider value={{ state, setState, currentStep, setCurrentStep, reset }}>
      {children}
    </ValutazioneWizardContext.Provider>
  )
}

export function useValutazioneWizard() {
  const context = useContext(ValutazioneWizardContext)
  if (!context) {
    throw new Error('useValutazioneWizard must be used within ValutazioneWizardProvider')
  }
  return context
}
