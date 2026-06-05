import { wizardStore } from '../store/wizardStore'
import { runPOCAnalysis } from '../engine/pocAnalysis'
import { getMatrixQuestions, loadPocData } from './poc_docfap/evaluation_matrix'
import type { AlternativaData, AlternativaId } from '../types/docfap'

/* ──────────────────────────────────────────────────────────────────────────
   Dataset DOCFAP di esempio (scenario "Asilo nido — Comune di Colleferro",
   cluster C03). Popola lo store quando è vuoto, così gli esempi della dashboard
   sono navigabili e la pagina di dettaglio mostra subito grafici, KPI e tabelle
   senza dover percorrere il wizard.
   Non sovrascrive un'analisi reale già presente (guardia su scoreFinale).
   ────────────────────────────────────────────────────────────────────────── */

const MCA_PATTERN: Record<string, Array<'A' | 'M' | 'B' | 'N'>> = {
  A1: ['A', 'M', 'A', 'M', 'A', 'M'],
  A2: ['M', 'A', 'M', 'B', 'M', 'A'],
  A3: ['B', 'B', 'M', 'A', 'B', 'M'],
}

const DEMO_ALTERNATIVES: Record<'A1' | 'A2' | 'A3', AlternativaData> = {
  A1: {
    categoria: '', tipologia: '', nome: 'Nuova costruzione asilo nido',
    quantita: 1500, capex: 2_640_000, opex: 420_000, durataStimata: 24,
    robustezza: 2, clusterId: 'C03', unitaMisura: 'posti',
  } as AlternativaData,
  A2: {
    categoria: '', tipologia: '', nome: 'Ristrutturazione asilo nido esistente',
    quantita: 1100, capex: 1_440_000, opex: 310_000, durataStimata: 18,
    robustezza: 1, clusterId: 'C03', unitaMisura: 'posti',
  } as AlternativaData,
  A3: {
    categoria: '', tipologia: '', nome: 'Voucher per servizi educativi 0-3',
    quantita: 178, capex: 0, opex: 600_000, durataStimata: 12,
    robustezza: 0, clusterId: 'C03', unitaMisura: 'beneficiari',
  } as AlternativaData,
}

let demoLoadPromise: Promise<void> | null = null

/** True se lo store contiene già un'analisi (reale o demo). */
function hasData(): boolean {
  return (wizardStore.getState().scoreFinale?.length ?? 0) > 0
}

/** Popola lo store con il dataset di esempio. Idempotente e non distruttivo. */
export async function loadDocfapDemo(): Promise<void> {
  if (hasData()) return
  if (demoLoadPromise) return demoLoadPromise

  demoLoadPromise = loadDocfapDemoInternal().finally(() => {
    demoLoadPromise = null
  })

  return demoLoadPromise
}

async function loadDocfapDemoInternal(): Promise<void> {
  if (hasData()) return

  const a = wizardStore.actions

  a.setRup({ nome: 'Marco Bianchi', qualifica: 'RUP', email: 'marco.bianchi@comune.colleferro.rm.it' })
  a.setFab('FAB-51', 'TC03')
  a.setCluster('C03')
  a.setIntervento({ denominazione: 'Nuovo asilo nido comunale', fonteFinanziamento: 'PNRR — Missione 4' })
  a.setLocalizzazione({ comune: 'Colleferro', provincia: 'Roma' })
  a.setProblema({
    descrizione:
      'Carenza di posti negli asili nido comunali: la domanda di servizi educativi 0-3 anni supera ampiamente l’offerta attuale, con un gap stimato di 178 posti e lunghe liste di attesa.',
    documentato: 'si',
  })
  a.setUrgenza('Breve termine (1-3 anni)')
  a.setScenarioZeroNarrative(
    "Il servizio educativo 0-3 è presente ma con liste d'attesa lunghe e una quota significativa di domande inevase; ne derivano minore occupazione femminile e ricorso a soluzioni private a costi elevati.",
  )

  const altIds: AlternativaId[] = ['A1', 'A2', 'A3']
  a.setAlternativeDefinite(altIds)
  altIds.forEach((id) => a.addAlternativa(id, DEMO_ALTERNATIVES[id as 'A1' | 'A2' | 'A3']))
  a.setAlternativeAggiuntaCompletata(true)

  // Rischi (C03_R_01..06 per A1/A2/A3)
  a.prefillPOCAnswers('C03', altIds)

  // MCA: assegna un giudizio a ogni domanda del cluster C03
  await loadPocData()
  const questions = getMatrixQuestions(['C03'])
  altIds.forEach((id) => {
    const pattern = MCA_PATTERN[id] ?? MCA_PATTERN.A1
    questions.forEach((q, i) => a.setMcaScores(id, q.qCode, pattern[i % pattern.length]))
  })

  // Punteggi compositi (CBA, impatto, rischio, sensitività, MCA, finale)
  a.setScore(runPOCAnalysis())
}
