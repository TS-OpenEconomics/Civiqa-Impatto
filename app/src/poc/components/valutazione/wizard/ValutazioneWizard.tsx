/* ══════════════════════════════════════════════════════════════
   ValutazioneWizard.tsx
   Orchestrates the 14-step Valutazione setup wizard.
   Steps 1-8: Profilazione
   Steps 9-10: Contesto operativo
   Steps 12-14: Parametri economici
   ══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import type { CbaBenefitSeriesInput } from '../../../contexts/ValutazioneWizardContext'
import type { AnalysisType } from '../../../data/mockValutazione'
import { ValutazioneWizardLayout } from './ValutazioneWizardLayout'
import { CbaKpiReviewPage } from './CbaKpiReviewPage'
import { CompletionScreen } from './CompletionScreen'
import { StepIntro } from './StepIntro'
import { StepAnagrafica } from './StepAnagrafica'
import { StepDescrizione } from './StepDescrizione'
import { StepStatoProgetto } from './StepStatoProgetto'
import { StepSettore } from './StepSettore'
import { StepSottoSettore } from './StepSottoSettore'
import { StepCategoria } from './StepCategoria'
import { StepTipoIntervento } from './StepTipoIntervento'
import { StepDurata } from './StepDurata'
import { StepLocalizzazione } from './StepLocalizzazione'
import { StepQuantitaTarget } from './StepQuantitaTarget'
import { StepAnnoAttualizzazione } from './StepAnnoAttualizzazione'
import { StepCapexValue } from './StepCapexValue'
import { StepOpexInput } from './StepOpexInput'

const TOTAL_STEPS = 14

export interface ValutazioneWizardCompletion {
  data: ReturnType<typeof useValutazioneWizard>['state']
  destination: 'project' | 'analysis'
  analyses: AnalysisType[]
  cbaBenefitSeries?: CbaBenefitSeriesInput[]
}

interface Props {
  onClose: () => void
  onComplete: (result: ValutazioneWizardCompletion) => void
}

function isNextDisabled(step: number, state: ReturnType<typeof useValutazioneWizard>['state']): boolean {
  switch (step) {
    case 1:  return false                                   // Intro: always enabled
    case 2:  return !state.project_name.trim()              // Anagrafica: name required
    case 3:  return !state.project_description.trim()       // Descrizione: required
    case 4:  return !state.project_status                   // Stato: must pick one
    case 5:  return !state.sector_id                        // Settore: must pick one
    case 6:  return !state.subsector_id                     // Sotto-settore: must pick one
    case 7:  return !state.category_id                      // Categoria: must pick one
    case 8:  return !state.intervention_type_id             // Tipo: must pick one
    case 9:  return !state.start_date || !state.end_date    // Durata: both dates required
    case 10: return (                                       // Localizzazione: at least one confirmed address
      state.locations.length === 0 ||
      state.locations.some(l => !l.address)
    )
    case 11: return !state.target_quantity || state.target_quantity <= 0 // Quantità target: required
    case 12: return false                                   // Anno attualizzazione: always has a default
    case 13: return false                                   // CAPEX values: allow proceeding with warnings
    case 14: return false                                   // OPEX: allow proceeding with defaults or manual override
    default: return false
  }
}

function renderStep(step: number) {
  switch (step) {
    case 1:  return <StepIntro />
    case 2:  return <StepAnagrafica />
    case 3:  return <StepDescrizione />
    case 4:  return <StepStatoProgetto />
    case 5:  return <StepSettore />
    case 6:  return <StepSottoSettore />
    case 7:  return <StepCategoria />
    case 8:  return <StepTipoIntervento />
    case 9:  return <StepDurata />
    case 10: return <StepLocalizzazione />
    case 11: return <StepQuantitaTarget />
    case 12: return <StepAnnoAttualizzazione />
    case 13: return <StepCapexValue />
    case 14: return <StepOpexInput />
    default: return null
  }
}

export function ValutazioneWizard({ onClose, onComplete }: Props) {
  const { currentStep, setCurrentStep, state } = useValutazioneWizard()
  const [showCompletion, setShowCompletion] = useState(false)
  const [pendingAnalyses, setPendingAnalyses] = useState<AnalysisType[] | null>(null)

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowCompletion(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const nextLabel =
    currentStep === 1
      ? 'Inizia la configurazione'
      : currentStep === TOTAL_STEPS
      ? 'Concludi la configurazione'
      : 'Vai allo step successivo'

  if (showCompletion) {
    if (pendingAnalyses) {
      return (
        <CbaKpiReviewPage
          onClose={() => onComplete({ data: state, destination: 'project', analyses: [] })}
          onSubmit={(cbaBenefitSeries) => {
            onComplete({ data: state, destination: 'analysis', analyses: pendingAnalyses, cbaBenefitSeries })
          }}
        />
      )
    }

    return (
      <CompletionScreen
        onComplete={(action) => {
          if (action.kind === 'project') {
            onComplete({ data: state, destination: 'project', analyses: [] })
            return
          }

          if (action.analyses.includes('ECBA')) {
            setPendingAnalyses(action.analyses)
            return
          }

          onComplete({ data: state, destination: 'analysis', analyses: action.analyses })
        }}
      />
    )
  }

  return (
    <ValutazioneWizardLayout
      onNext={handleNext}
      onBack={handleBack}
      onClose={onClose}
      onGoToStep={setCurrentStep}
      nextDisabled={isNextDisabled(currentStep, state)}
      nextLabel={nextLabel}
      hideBack={currentStep === 1}
    >
      {renderStep(currentStep)}
    </ValutazioneWizardLayout>
  )
}
