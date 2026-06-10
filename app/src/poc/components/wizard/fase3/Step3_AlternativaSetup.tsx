import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { useWizard } from '../../../hooks/useWizard'
import { ProgressiveBlocks } from '../../ui/ProgressiveBlocks'
import type { ProgressiveBlockDef } from '../../ui/ProgressiveBlocks'
import { Step3_2_AlternativaCard } from './Step3_2_AlternativaCard'
import { Step3_NomeAlternativa } from './Step3_NomeAlternativa'

type AltId = 'A1' | 'A2' | 'A3'

const TIPOLOGIA_LABELS: Record<string, string> = {
  nuova_realizzazione: 'Nuova realizzazione',
  ristrutturazione: 'Ristrutturazione',
  ristrutturazione_efficientamento: 'Ristrutturazione con efficientamento energetico',
  manutenzione_straordinaria_ee: 'Manutenzione straordinaria con EE',
  manutenzione_ordinaria: 'Manutenzione ordinaria',
  restauro: 'Restauro',
  recupero: 'Recupero',
  ampliamento_potenziamento: 'Ampliamento / potenziamento',
  ammodernamento_tecnologico: 'Ammodernamento tecnologico',
  demolizione: 'Demolizione',
  lavori_socialmente_utili: 'Lavori socialmente utili',
  altro: 'Altro',
}

/**
 * Step combinato dell'alternativa: box ① selezione categoria/tipologia,
 * box ② nome dell'alternativa (sbloccato dopo il primo). Stesso pattern
 * dell'anagrafica di Valutazione.
 */
export function Step3_AlternativaSetup({ alternativaId }: { alternativaId: AltId }) {
  const { state } = useWizard()
  const alt = state.alternative[alternativaId]
  const categoria = alt?.categoria ?? ''
  const tipologia = alt?.tipologia ?? ''
  const catLabel = INTERVENTION_CATEGORIES.find((c) => c.code === categoria)?.label ?? categoria
  const tipLabel = TIPOLOGIA_LABELS[tipologia] ?? tipologia
  const configComplete = categoria.trim().length > 0 && tipologia.trim().length > 0
  const nome = (alt?.nome ?? '').trim()

  const blocks: ProgressiveBlockDef[] = [
    {
      id: 'config',
      title: 'Categoria e tipologia di intervento',
      complete: configComplete,
      summary: configComplete ? `${catLabel} — ${tipLabel}` : undefined,
      children: <Step3_2_AlternativaCard alternativaId={alternativaId} embedded />,
    },
    {
      id: 'nome',
      title: "Nome dell'alternativa",
      complete: nome.length > 0,
      summary: nome || undefined,
      children: <Step3_NomeAlternativa alternativaId={alternativaId} />,
    },
  ]

  return <ProgressiveBlocks blocks={blocks} />
}
