import { useCallback, useSyncExternalStore } from 'react'
import { wizardStore } from '../store/wizardStore'

function isFilled(value: string | undefined): boolean {
  return (value ?? '').trim().length > 0
}

export function useWizard() {
  const state = useSyncExternalStore(
    wizardStore.subscribe,
    wizardStore.getState,
    wizardStore.getState,
  )

  const isStepValid = useCallback(
    (stepNumber: number): boolean => {
      if (stepNumber < 0 || stepNumber > 5) return false
      switch (stepNumber) {
        case 0:
          return true
        case 1:
          return (
            isFilled(state.rup.nome) &&
            isFilled(state.rup.qualifica) &&
            isFilled(state.temaId ?? '') &&
            isFilled(state.fabId ?? '')
          )
        case 2:
          // Lo scenario zero è obbligatorio; il dato quantitativo (q1Value) è facoltativo.
          return (
            isFilled(state.problema.descrizione) &&
            isFilled(state.urgenza) &&
            isFilled(state.scenarioZeroNarrative)
          )
        case 3: {
          const hasMinimum = state.alternativeDefinite.length >= 2
          const allAlternativesValid = state.alternativeDefinite.every((id) => {
            const alt = state.alternative[id]
            return (
              alt !== null &&
              isFilled(alt.categoria) &&
              isFilled(alt.tipologia) &&
              (alt.obiettivoCer ?? alt.quantita ?? 0) > 0 &&
              (alt.capex ?? 0) > 0
            )
          })
          return hasMinimum && allAlternativesValid && state.alternativeAggiuntaCompletata
        }
        case 4: {
          if (!state.clusterId) return false
          const altIds = state.alternativeDefinite.filter(
            (id): id is 'A1' | 'A2' | 'A3' => id === 'A1' || id === 'A2' || id === 'A3',
          )
          if (altIds.length === 0) return false
          const mcaForAlt = state.mcaScores
          return altIds.every((altId) => {
            const scores = mcaForAlt[altId] ?? {}
            return Object.keys(scores).length > 0
          })
        }
        case 5: {
          const decisione = state.decisioneRUP
          if (!decisione) return false
          const availableIds = (state.scoreFinale ?? []).map((row) => row.alternativaId)
          return (
            availableIds.includes(decisione.alternativaScelta) &&
            isFilled(decisione.motivazione)
          )
        }
        default:
          return false
      }
    },
    [state],
  )

  return {
    state,
    ...wizardStore.actions,
    isStepValid,
  }
}
