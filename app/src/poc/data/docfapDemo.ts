import { wizardStore } from '../store/wizardStore'
import { runPOCAnalysis } from '../engine/pocAnalysis'
import { getMatrixQuestions, loadPocData } from './poc_docfap/evaluation_matrix'
import type { AlternativaData, AlternativaId } from '../types/docfap'

/* ──────────────────────────────────────────────────────────────────────────
   Dataset DOCFAP di esempio (scenario "Asilo nido — Comune di Colleferro",
   cluster C03). Popola lo store quando è vuoto, così i progetti COMPLETATI
   della home mostrano subito grafici, KPI e tabelle senza percorrere il wizard.

   STANDARD = 2 alternative (A1, A2): dà uno switcher con doppio dato a confronto
   in tutti i grafici dei risultati. Il sistema resta comunque capace di gestire
   una terza proposta (A3): se il wizard ne definisce una, alternativeDefinite la
   include e i grafici — che leggono via getDefinedScores — la mostrano in più.
   Non sovrascrive un'analisi reale già presente (guardia su scoreFinale).
   ────────────────────────────────────────────────────────────────────────── */

const MCA_PATTERN: Record<string, Array<'A' | 'M' | 'B' | 'N'>> = {
  A1: ['A', 'M', 'A', 'M', 'A', 'M'],
  A2: ['M', 'A', 'M', 'B', 'M', 'A'],
  A3: ['B', 'M', 'B', 'N', 'M', 'B'],
}

const DEMO_ALTERNATIVES: Record<'A1' | 'A2' | 'A3', AlternativaData> = {
  A1: {
    categoria: '', tipologia: '', nome: 'Nuova costruzione asilo nido',
    quantita: 90, capex: 2_640_000, opex: 420_000, durataStimata: 24,
    robustezza: 2, clusterId: 'C03', unitaMisura: 'posti',
  } as AlternativaData,
  A2: {
    categoria: '', tipologia: '', nome: 'Ristrutturazione asilo nido esistente',
    quantita: 84, capex: 1_440_000, opex: 300_000, durataStimata: 18,
    robustezza: 1, clusterId: 'C03', unitaMisura: 'posti',
  } as AlternativaData,
  A3: {
    categoria: '', tipologia: '', nome: 'Voucher alle famiglie per servizi 0-3',
    quantita: 180, capex: 0, opex: 600_000, durataStimata: 6,
    robustezza: 1, clusterId: 'C03', unitaMisura: 'beneficiari',
  } as AlternativaData,
}

/** Override opzionali per far combaciare l'intestazione del dettaglio col
 *  progetto cliccato nella lista (i punteggi restano quelli dello scenario demo). */
export interface DocfapDemoOverrides {
  denominazione?: string
  comune?: string
  provincia?: string
  proprietario?: string
  fonteFinanziamento?: string
}

let demoLoadPromise: Promise<void> | null = null

/** True se lo store contiene già un'analisi (reale o demo). */
function hasData(): boolean {
  return (wizardStore.getState().scoreFinale?.length ?? 0) > 0
}

/** Popola lo store con il dataset di esempio. Idempotente e non distruttivo. */
export async function loadDocfapDemo(overrides?: DocfapDemoOverrides): Promise<void> {
  if (hasData()) return
  if (demoLoadPromise) return demoLoadPromise

  demoLoadPromise = loadDocfapDemoInternal(overrides).finally(() => {
    demoLoadPromise = null
  })

  return demoLoadPromise
}

async function loadDocfapDemoInternal(overrides?: DocfapDemoOverrides): Promise<void> {
  if (hasData()) return

  // Carica i dati MCA PRIMA di scrivere lo store: così tutte le setX avvengono
  // dopo l'await, in un blocco unico. Un reset() concorrente (StrictMode o il
  // useEffect di DocfapDetail) avviene durante l'await e non può lasciare lo
  // stato a metà (es. alternativeDefinite azzerate prima di setScore).
  await loadPocData()
  if (hasData()) return

  const altIds: AlternativaId[] = ['A1', 'A2', 'A3']
  const a = wizardStore.actions

  a.setRup({
    nome: overrides?.proprietario ?? 'Marco Bianchi',
    qualifica: 'RUP',
    email: 'marco.bianchi@comune.colleferro.rm.it',
  })
  a.setFab('FAB-51', 'TC03')
  a.setCluster('C03')
  a.setIntervento({
    denominazione: overrides?.denominazione ?? 'Nuovo asilo nido comunale',
    fonteFinanziamento: overrides?.fonteFinanziamento ?? 'PNRR — Missione 4',
  })
  a.setLocalizzazione({
    comune: overrides?.comune ?? 'Colleferro',
    provincia: overrides?.provincia ?? 'Roma',
  })
  a.setProblema({
    descrizione:
      'Carenza di posti negli asili nido comunali: la domanda di servizi educativi 0-3 anni supera ampiamente l’offerta attuale, con un gap stimato di 178 posti e lunghe liste di attesa.',
    documentato: 'si',
  })
  a.setUrgenza('Breve termine (1-3 anni)')
  a.setScenarioZeroNarrative(
    "Il servizio educativo 0-3 è presente ma con liste d'attesa lunghe e una quota significativa di domande inevase; ne derivano minore occupazione femminile e ricorso a soluzioni private a costi elevati.",
  )

  a.setAlternativeDefinite(altIds)
  altIds.forEach((id) => a.addAlternativa(id, DEMO_ALTERNATIVES[id as 'A1' | 'A2' | 'A3']))
  a.setAlternativeAggiuntaCompletata(true)

  // Rischi + MCA per ogni alternativa definita
  a.prefillPOCAnswers('C03', altIds)

  const questions = getMatrixQuestions(['C03'])
  altIds.forEach((id) => {
    const pattern = MCA_PATTERN[id] ?? MCA_PATTERN.A1
    questions.forEach((q, i) => a.setMcaScores(id, q.qCode, pattern[i % pattern.length]))
  })

  // Punteggi compositi limitati alle alternative definite (standard = A1/A2).
  a.setScore(runPOCAnalysis().filter((s) => altIds.includes(s.alternativaId)))
}
