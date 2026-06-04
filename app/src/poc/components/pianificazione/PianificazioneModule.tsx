import { PlanningProvider, usePlanning } from '../../PlanningContext'
import { EntryChoice } from './EntryChoice'
import { TaxonomyNavigator } from './TaxonomyNavigator'
import { EnteContext } from './EnteContext'
import { BudgetTimeInput } from './BudgetTimeInput'
import { InterventionList } from './InterventionList'
import { ParameterCalibrator } from './ParameterCalibrator'
import { PlanningHandoff } from './PlanningHandoff'
import { PortfolioBuilder } from './PortfolioBuilder'

/* ─── Step router interno al modulo Pianificazione ─── */

function PlanningRouter() {
  const { state } = usePlanning()

  switch (state.step) {
    case 'entry':
      return <EntryChoice />
    case 'taxonomy':
      return <TaxonomyNavigator />
    case 'contesto':
      return <EnteContext />
    case 'vincoli':
      return <BudgetTimeInput />
    case 'interventi':
      return <InterventionList />
    case 'calibrazione':
      return <ParameterCalibrator />
    case 'riepilogo':
      return <PlanningHandoff />
    case 'portfolio':
      return <PortfolioBuilder />
    default:
      return <EntryChoice />
  }
}

/* ─── Module entry point ─── */

export function PianificazioneModule() {
  return (
    <PlanningProvider>
      <PlanningRouter />
    </PlanningProvider>
  )
}