import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { WizardState } from './types'

const defaultState: WizardState = {
  selectedProjects: ['ALT_A', 'ALT_B', 'ALT_C', 'ALT_D'],
  progettoRiferimento: 'ALT_A',
  fabbisogni: {
    descrizione: '',
    popolazione: null,
    urgenza: null,
    urgenzaMotivazione: '',
    strumentiPianificazione: '',
    conseguenzeNonIntervento: '',
    annoCostruzione: null,
    classeSismica: null,
    spazNonConformi: null,
    opexSoglia: null,
  },
  opzioneZero: {
    statoOperativo: 'parziale',
    capexManutenzione: 180000,
    tassoDegrado: 3,
    kpiValues: {
      'Servizio educativo parzialmente erogato': 35000,
      'Utilizzo strutture esistenti': 12000,
      'Rischio sismico non mitigato': -12000,
      'Inefficienza energetica persistente': -28000,
      'Costi manutenzione straordinaria': -45000,
      'Costi sostitutivi per utenti': -8000,
    },
    kpiMotivazioni: {},
  },
  mca: {
    koValues: {},
    rankingValues: {},
    pesoMcaRanking: 20,
  },
  rischi: {
    grid: {},
    mitigazioni: {},
    mitigazioniSpecifiche: {},
    pesoRischi: 15,
  },
  anagrafica: {
    nome: 'Riqualificazione rete scolastica — Colleferro 2026',
    descrizione: 'Analisi di fattibilità per la riqualificazione degli edifici scolastici comunali conforme al D.Lgs. 36/2023 Allegato I.7.',
    tag: ['Scuole', 'Colleferro', '2026', 'D.Lgs.36/2023'],
  },
}

interface WizardContextType {
  state: WizardState
  setState: (updates: Partial<WizardState>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

const WizardContext = createContext<WizardContextType | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<WizardState>(defaultState)
  const [currentStep, setCurrentStep] = useState(1)

  const setState = (updates: Partial<WizardState>) => {
    setStateRaw(prev => ({ ...prev, ...updates }))
  }

  return (
    <WizardContext.Provider value={{ state, setState, currentStep, setCurrentStep }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}
