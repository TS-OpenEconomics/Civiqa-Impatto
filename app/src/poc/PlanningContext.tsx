import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Categoria, FabbisognoTipo } from './data/mockTaxonomy'
import type { InterventoMOP } from './data/mockMOP'
import type { Inefficienza } from './data/mockDataRoom'

/* ─── Types ─── */

export type Modalita = 'diretto' | 'guidato' | 'completo'

export type StepPianificazione =
  | 'entry'           // Scelta modalità
  | 'taxonomy'        // Navigazione categorie (mod 1+2)
  | 'contesto'        // Screening contesto ente
  | 'vincoli'         // Input budget + tempo
  | 'interventi'      // Ventaglio interventi + cutoff
  | 'calibrazione'    // Calibrazione parametri
  | 'riepilogo'       // Riepilogo e handoff
  | 'portfolio'       // Solo mod 3: composizione portafoglio

export interface InterventoSelezionato {
  intervento: InterventoMOP
  parametriCustom: Record<string, number>
  costoStimato: number
  durataStimata: number
}

export interface PlanningState {
  modalita: Modalita | null
  step: StepPianificazione
  lente: 'neutra' | 'inefficienze'

  // Selezione fabbisogno
  categoriaSelezionata: Categoria | null
  fabbisognoSelezionato: FabbisognoTipo | null
  inefficienzeSelezionate: Inefficienza[]

  // Vincoli
  capexMax: number
  opexAnnuoMax: number
  orizzonteTemporaleMesi: number

  // Interventi
  interventiSelezionati: InterventoSelezionato[]

  // Mod 3: budget totale
  budgetTotaleProgrammazione: number
  dupCaricato: boolean
}

interface PlanningContextType {
  state: PlanningState
  setState: (update: Partial<PlanningState>) => void
  goToStep: (step: StepPianificazione) => void
  reset: () => void
}

/* ─── Initial state ─── */

const initialState: PlanningState = {
  modalita: null,
  step: 'entry',
  lente: 'neutra',
  categoriaSelezionata: null,
  fabbisognoSelezionato: null,
  inefficienzeSelezionate: [],
  capexMax: 0,
  opexAnnuoMax: 0,
  orizzonteTemporaleMesi: 0,
  interventiSelezionati: [],
  budgetTotaleProgrammazione: 0,
  dupCaricato: false,
}

/* ─── Context ─── */

const PlanningCtx = createContext<PlanningContextType | null>(null)

export function PlanningProvider({ children }: { children: ReactNode }) {
  const [state, setRawState] = useState<PlanningState>(initialState)

  const setState = (update: Partial<PlanningState>) => {
    setRawState(prev => ({ ...prev, ...update }))
  }

  const goToStep = (step: StepPianificazione) => {
    setRawState(prev => ({ ...prev, step }))
  }

  const reset = () => setRawState(initialState)

  return (
    <PlanningCtx.Provider value={{ state, setState, goToStep, reset }}>
      {children}
    </PlanningCtx.Provider>
  )
}

export function usePlanning() {
  const ctx = useContext(PlanningCtx)
  if (!ctx) throw new Error('usePlanning must be used inside PlanningProvider')
  return ctx
}