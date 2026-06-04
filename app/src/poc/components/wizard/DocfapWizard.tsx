import { useCallback, useMemo } from 'react'
import { useWizard } from '../../hooks/useWizard'
import { getMatrixQuestions } from '../../data/poc_docfap/evaluation_matrix'
import { INTERVENTION_CATEGORIES } from '../../data/poc_docfap/intervention_categories_layer3'
import { getCostiByCategory, calcolaCostoTipologia } from '../../data/poc_docfap/costi_per_tipologia'
import { WizardShell, type WizardClosePayload, type WizardPhaseDefinition } from './WizardShell'
import { Step0_Intro } from './fase0/Step0_Intro'
import { Step1_1_Ente } from './fase1/Step1_1_Ente'
import { Step1_3_FabbisognoTema } from './fase1/Step1_3_FabbisognoTema'
import { Step1_4_FabbisognoSpecifico } from './fase1/Step1_4_FabbisognoSpecifico'
import { Step2_1_Problema } from './fase2/Step2_1_Problema'
import { ScenarioZeroQuestions } from './fase2/ScenarioZeroQuestions'
import { DatoContestoQ1 } from './fase2/DatoContestoQ1'
import { Step3_2_AlternativaCard } from './fase3/Step3_2_AlternativaCard'
import { InputParamsStep } from './fase3/InputParamsStep'
import { Step3_NomeAlternativa } from './fase3/Step3_NomeAlternativa'
import { Step3_AggiuntaAlternativa } from './fase3/Step3_AggiuntaAlternativa'
import { McaQualitativa } from './fase4/McaQualitativa'
import { AllegatiNormativi } from './fase5/AllegatiNormativi'
import { Step7_ScoreFinale } from './fase5/Step7_ScoreFinale'
import { Step7_DecisioneRUP } from './fase5/Step7_DecisioneRUP'
import { Step1_2_Intervento } from './fase1/Step1_2_Intervento'
import { Step7_GeneraDocfap } from './fase5/Step7_GeneraDocfap'
import { Step7_Completamento } from './fase5/Step7_Completamento'

type SupportedAlternativaId = 'A1' | 'A2' | 'A3'

interface DocfapWizardProps {
  onClose?: (payload: WizardClosePayload) => void
}

function isSupportedAlternativaId(value: string): value is SupportedAlternativaId {
  return value === 'A1' || value === 'A2' || value === 'A3'
}

function getAlternativaOrdinalLabel(id: SupportedAlternativaId): string {
  return `Alternativa ${id.slice(1)}`
}

export function DocfapWizard({ onClose }: DocfapWizardProps) {
  const {
    state,
    setRup,
    setFab,
    setCluster,
    setProblema,
    setUrgenza,
    setScenarioZeroAnswers,
    setScenarioZeroNarrative,
    setAlternativeDefinite,
    addAlternativa,
    setAlternativeAggiuntaCompletata,
    setMcaScores,
    prefillPOCAnswers,
  } = useWizard()
  const supportedAlternativeIds = useMemo(
    () => state.alternativeDefinite.filter(isSupportedAlternativaId),
    [state.alternativeDefinite],
  )

  // Autoriempi: prefill demo (scenario Asilo Nido — Comune di Colleferro, cluster C03)
  // per la fase corrente. Mostrato solo sulle fasi di input (1·Inquadramento,
  // 2·Bisogno, 3·Alternative), come nel wizard di Valutazione.
  const autoFillPhase = useCallback(
    (phaseIndex: number) => {
      switch (phaseIndex) {
        case 1:
          setRup({ nome: 'Marco Bianchi', qualifica: 'RUP', email: 'marco.bianchi@comune.colleferro.rm.it' })
          // FAB-51 = "Offerta insufficiente di posti nido (0-3 anni)" · tema TC03 · cluster C03
          setFab('FAB-51', 'TC03')
          setCluster('C03')
          break
        case 2:
          setProblema({
            descrizione:
              'Carenza di posti negli asili nido comunali: la domanda di servizi educativi 0-3 anni supera ampiamente l’offerta attuale, con un gap stimato di 178 posti e lunghe liste di attesa.',
            documentato: 'si',
          })
          setUrgenza('Breve termine (1-3 anni)')
          // Scenario zero: seleziona le risposte reali (FAB-51) così le opzioni
          // risultano spuntate e la narrativa è coerente con esse.
          setScenarioZeroAnswers({
            'DC-SZ-051-01': 'lista_attesa',
            'DC-SZ-051-02': ['occupazione_femminile', 'costi_privati'],
          })
          setScenarioZeroNarrative(
            "Il servizio educativo 0-3 è presente e funzionante, ma le liste d'attesa sono lunghe, con una quota significativa di domande che non trovano risposta nell'offerta disponibile. Si registra inoltre un tasso di occupazione femminile inferiore alla media, correlato alla mancanza di servizi di cura per la prima infanzia, e famiglie che ricorrono a soluzioni private a costi elevati.",
          )
          // q1Value (dato quantitativo di contesto) è facoltativo → non lo precompiliamo.
          break
        case 3: {
          setAlternativeDefinite(['A1', 'A2'])
          // Categoria/tipologia DEVONO essere codici reali: la categoria è un
          // cat.code i cui fabbisogno_codes includono il FAB selezionato, la
          // tipologia un tipologia_code applicabile. (label inventate = select vuote.)
          const cats = INTERVENTION_CATEGORIES.filter((c) => c.fabbisogno_codes.includes(state.fabId ?? 'FAB-51'))
          const cat = cats.find((c) => c.code === 'C106') ?? cats[0]
          const categoria = cat?.code ?? 'C106'
          const clusterId = cat?.cluster_id && cat.cluster_id !== 'NONE' ? cat.cluster_id : 'C03'
          // CAPEX = CP_med × quantità (stessa formula di InputParamsStep), così la
          // fase è valida subito ed è robusta a ri-click di Autoriempi.
          const costiRecords = getCostiByCategory(categoria)
          const capexFor = (costiCode: 'NUOVA_REALIZZAZIONE' | 'RISTRUTTURAZIONE', qty: number): number => {
            if (costiRecords.length === 0) return 0
            const costo = calcolaCostoTipologia(costiRecords[0], costiCode)
            return costo ? Math.round(costo.val_med * qty) : 0
          }
          const a1Capex = capexFor('NUOVA_REALIZZAZIONE', 1500)
          const a2Capex = capexFor('RISTRUTTURAZIONE', 1100)
          addAlternativa('A1', {
            categoria,
            tipologia: 'nuova_realizzazione',
            quantita: 1500,
            obiettivoCer: 178,
            capex: a1Capex,
            opex: Math.round(a1Capex * 0.05),
            nome: 'Nuova costruzione asilo nido',
            clusterId,
            unitaMisura: 'posti',
          } as never)
          addAlternativa('A2', {
            categoria,
            tipologia: 'ristrutturazione',
            quantita: 1100,
            obiettivoCer: 120,
            capex: a2Capex,
            opex: Math.round(a2Capex * 0.05),
            nome: 'Ristrutturazione asilo nido esistente',
            clusterId,
            unitaMisura: 'posti',
          } as never)
          setCluster(clusterId)
          setAlternativeAggiuntaCompletata(true)
          prefillPOCAnswers('C03', ['A1', 'A2'])
          break
        }
        case 4: {
          // Analisi Multicriteria: assegna un giudizio qualitativo (A/M/B/N) a ogni
          // cella della matrice (domande × alternative) con un pattern differenziato.
          const clusterIds = state.clusterId ? [state.clusterId] : []
          const questions = getMatrixQuestions(clusterIds)
          const altIds = state.alternativeDefinite.filter(isSupportedAlternativaId)
          // Pattern per alternativa: ciclato sull'indice domanda.
          const patterns: Record<string, Array<'A' | 'M' | 'B' | 'N'>> = {
            A1: ['A', 'M', 'A', 'M', 'A', 'M'],
            A2: ['M', 'A', 'M', 'B', 'M', 'A'],
            A3: ['B', 'B', 'M', 'A', 'B', 'M'],
          }
          altIds.forEach((altId) => {
            const pattern = patterns[altId] ?? patterns.A1
            questions.forEach((q, qi) => {
              setMcaScores(altId, q.qCode, pattern[qi % pattern.length])
            })
          })
          break
        }
        default:
          break
      }
    },
    [setRup, setFab, setCluster, setProblema, setUrgenza, setScenarioZeroAnswers, setScenarioZeroNarrative, setAlternativeDefinite, addAlternativa, setAlternativeAggiuntaCompletata, setMcaScores, prefillPOCAnswers, state.clusterId, state.alternativeDefinite, state.fabId],
  )

  const phases = useMemo<WizardPhaseDefinition[]>(() => {
    const phase3Substeps = supportedAlternativeIds.flatMap((alternativaId) => {
      const alternativaSidebarLabel = getAlternativaOrdinalLabel(alternativaId)
      return [
        {
          id: `fase3-${alternativaId.toLowerCase()}-setup`,
          title: alternativaSidebarLabel,
          questions: [
            {
              title: `Configura ${alternativaSidebarLabel}`,
              subtitle: "Seleziona categoria e tipologia dell'alternativa progettuale.",
              normRef: 'Art. 2, c.4, c)',
              content: <Step3_2_AlternativaCard alternativaId={alternativaId} />,
            },
          ],
        },
        {
          id: `fase3-${alternativaId.toLowerCase()}-params`,
          title: alternativaSidebarLabel,
          questions: [
            {
              title: `Parametri di ${alternativaSidebarLabel}`,
              subtitle: 'Parametri di costo e durata pre-elaborati per questa alternativa.',
              normRef: 'Art. 2, c.4, e) + f)',
              content: <InputParamsStep alternativaId={alternativaId} />,
            },
          ],
        },
        {
          id: `fase3-${alternativaId.toLowerCase()}-nome`,
          title: alternativaSidebarLabel,
          questions: [
            {
              title: `Dai un nome a ${alternativaSidebarLabel}`,
              subtitle: 'Usa un nome chiaro per distinguerla dalle altre opzioni.',
              normRef: 'Art. 2, c.4, c)',
              content: <Step3_NomeAlternativa alternativaId={alternativaId} />,
            },
          ],
        },
      ]
    })

    return [
      {
        id: 'fase-0',
        title: 'Introduzione',
        substeps: [
          {
            id: 'fase0-intro',
            title: 'Avvio',
            questions: [
              {
                title: 'Configura un nuovo DOCFAP',
                subtitle: 'Imposta i dati essenziali e confronta le alternative progettuali in modo guidato.',
                content: <Step0_Intro />,
              },
            ],
          },
        ],
      },
      {
        id: 'fase-1',
        title: 'Inquadramento',
        substeps: [
          {
            id: 'fase1-ente',
            title: 'Ente e RUP',
            questions: [
              {
                title: "Dati dell'ente e del RUP",
                subtitle: 'Verifica i dati di contesto e inserisci i riferimenti principali della compilazione.',
                normRef: 'Art. 2, c.1',
                content: <Step1_1_Ente />,
              },
            ],
          },
          {
            id: 'fase1-tema',
            title: 'Tema',
            questions: [
              {
                title: 'In che macro tema si inserisce il fabbisogno da soddisfare?',
                subtitle: "Individua l'ambito tematico in cui ricade il fabbisogno.",
                normRef: 'Art. 2, c.2',
                content: <Step1_3_FabbisognoTema />,
              },
            ],
          },
          {
            id: 'fase1-fabbisogno',
            title: 'Fabbisogno',
            questions: [
              {
                title: "Qual è il fabbisogno specifico da soddisfare?",
                subtitle: 'Individua il fabbisogno corretto per associare il DOCFAP al quadro programmatorio.',
                normRef: 'Art. 2, c.2',
                content: <Step1_4_FabbisognoSpecifico />,
              },
            ],
          },
        ],
      },
      {
        id: 'fase-2',
        title: 'Bisogno',
        substeps: [
          {
            id: 'fase2-problema',
            title: 'Fabbisogno',
            questions: [
              {
                title: 'Descrivi il Fabbisogno',
                subtitle: 'Rendi esplicito il bisogno pubblico, la sua evidenza e il contesto attuale.',
                normRef: 'Art. 2, c.2',
                content: <Step2_1_Problema />,
              },
            ],
          },
          {
            id: 'fase2-sz-questions',
            title: 'Scenario zero',
            questions: [
              {
                title: 'Scenario zero — situazione attuale',
                subtitle: 'Rispondi alle domande per costruire la narrativa dello scenario attuale.',
                normRef: 'Art. 2, c.4, a)',
                content: <ScenarioZeroQuestions />,
              },
            ],
          },
          {
            id: 'fase2-q1',
            title: 'Dato di contesto',
            questions: [
              {
                title: 'Dato quantitativo di contesto',
                subtitle: 'Inserisci il dato chiave che definisce la dimensione del fabbisogno.',
                normRef: 'Art. 2, c.4, a)',
                content: <DatoContestoQ1 />,
              },
            ],
          },
        ],
      },
      {
        id: 'fase-3',
        title: 'Alternative',
        substeps: [
          ...phase3Substeps,
          {
            id: 'fase3-aggiunta',
            title: 'Nuove alternative',
            questions: [
              {
                title: 'Aggiungi o conferma le alternative',
                subtitle: 'Definisci almeno due alternative progettuali prima di proseguire.',
                normRef: 'Art. 2, c.4, c)',
                content: <Step3_AggiuntaAlternativa />,
              },
            ],
          },
        ],
      },
      {
        id: 'fase-4',
        title: 'Analisi Multicriteria',
        substeps: [
          {
            id: 'fase4-mca',
            title: 'Valutazione MCA',
            questions: [
              {
                title: 'Analisi Multicriteria qualitativa',
                subtitle: 'Valuta le alternative su criteri qualitativi. Scala: A (Alto) · M (Medio) · B (Basso) · N (Nullo).',
                normRef: 'Art. 2, c.4, g) + c.7',
                content: <McaQualitativa />,
              },
            ],
          },
        ],
      },
      {
        id: 'fase-5',
        title: 'Decisione',
        substeps: [
          {
            id: 'fase5-score',
            title: 'Score finale',
            questions: [
              {
                title: 'Calcola lo score finale',
                subtitle: 'Integra gli esiti delle analisi per ottenere il punteggio composito.',
                normRef: 'Art. 2, c.4, g) + c.7',
                content: <Step7_ScoreFinale />,
              },
            ],
          },
          {
            id: 'fase5-decisione',
            title: 'Decisione RUP',
            questions: [
              {
                title: 'Formalizza la decisione del RUP',
                subtitle: "Seleziona l'alternativa preferita e motiva la scelta conclusiva.",
                normRef: 'Art. 2, c.4, g) + c.7',
                content: <Step7_DecisioneRUP />,
              },
            ],
          },
          {
            id: 'fase5-intervento',
            title: 'Intervento',
            questions: [
              {
                title: "Identifica l'intervento",
                subtitle: 'Definisci denominazione, CUP/CUI e fonte di finanziamento prevalente.',
                content: <Step1_2_Intervento />,
              },
            ],
          },
          {
            id: 'fase5-allegati',
            title: 'Allegati',
            questions: [
              {
                title: 'Allegati normativi',
                subtitle: 'Documenti normativi richiesti dal D.Lgs. 36/2023 All. I.7.',
                content: <AllegatiNormativi />,
              },
            ],
          },
          {
            id: 'fase5-genera',
            title: 'Genera DOCFAP',
            questions: [
              {
                title: 'Genera il documento finale',
                subtitle: 'Prepara il riepilogo conclusivo del DOCFAP con le informazioni raccolte.',
                normRef: 'Art. 2, c.9',
                content: <Step7_GeneraDocfap />,
              },
            ],
          },
          {
            id: 'fase5-completamento',
            title: 'Completamento',
            questions: [
              {
                title: 'DOCFAP completato',
                subtitle: 'Apri i risultati o torna alla lista dei DOCFAP salvati.',
                normRef: 'Art. 2, c.9',
                content: <Step7_Completamento />,
              },
            ],
          },
        ],
      },
    ]
  }, [supportedAlternativeIds])

  return (
    <WizardShell
      phases={phases}
      onClose={onClose}
      onAutofill={autoFillPhase}
      autofillPhaseIndexes={[1, 2, 3, 4]}
    />
  )
}
