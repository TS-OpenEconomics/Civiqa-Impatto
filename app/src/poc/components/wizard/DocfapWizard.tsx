import { useCallback, useEffect, useMemo } from 'react'
import { useWizard } from '../../hooks/useWizard'
import { getMatrixQuestions } from '../../data/poc_docfap/evaluation_matrix'
import { INTERVENTION_CATEGORIES } from '../../data/poc_docfap/intervention_categories_layer3'
import { getCostiByCategory, calcolaCostoTipologia } from '../../data/poc_docfap/costi_per_tipologia'
import { WizardShell, type WizardClosePayload, type WizardPhaseDefinition } from './WizardShell'
import { Step0_Intro } from './fase0/Step0_Intro'
import { Step1_1_Ente } from './fase1/Step1_1_Ente'
import { Step1_3_FabbisognoTema } from './fase1/Step1_3_FabbisognoTema'
import { Step2_1_Problema } from './fase2/Step2_1_Problema'
import { ScenarioZeroQuestions } from './fase2/ScenarioZeroQuestions'
import { DatoContestoQ1 } from './fase2/DatoContestoQ1'
import { InputParamsStep } from './fase3/InputParamsStep'
import { Step3_AlternativaSetup } from './fase3/Step3_AlternativaSetup'
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
    bumpAutofill,
  } = useWizard()
  const supportedAlternativeIds = useMemo(
    () => state.alternativeDefinite.filter(isSupportedAlternativaId),
    [state.alternativeDefinite],
  )

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Autoriempi: prefill demo (scenario Asilo Nido — Comune di Colleferro, cluster C03).
  // Riempie SOLO la pagina corrente (un autoriempi per pagina), come nel wizard di
  // Valutazione. La pagina è identificata dall'id del substep.
  const autoFillPage = useCallback(
    ({ subStepId }: { phaseIndex: number; subStepId: string }) => {
      const ALT_PRESET: Record<SupportedAlternativaId, {
        tipologia: string
        quantita: number
        obiettivoCer: number
        nome: string
        costiCode: 'NUOVA_REALIZZAZIONE' | 'RISTRUTTURAZIONE'
      }> = {
        A1: { tipologia: 'nuova_realizzazione', quantita: 1500, obiettivoCer: 178, nome: 'Nuova costruzione asilo nido', costiCode: 'NUOVA_REALIZZAZIONE' },
        A2: { tipologia: 'ristrutturazione', quantita: 1100, obiettivoCer: 120, nome: 'Ristrutturazione asilo nido esistente', costiCode: 'RISTRUTTURAZIONE' },
        A3: { tipologia: 'ristrutturazione', quantita: 900, obiettivoCer: 90, nome: 'Recupero immobile esistente', costiCode: 'RISTRUTTURAZIONE' },
      }

      const resolveCategoria = () => {
        const cats = INTERVENTION_CATEGORIES.filter((c) => c.fabbisogno_codes.includes(state.fabId ?? 'FAB-51'))
        const cat = cats.find((c) => c.code === 'C106') ?? cats[0]
        const categoria = cat?.code ?? 'C106'
        const clusterId = cat?.cluster_id && cat.cluster_id !== 'NONE' ? cat.cluster_id : 'C03'
        return { categoria, clusterId }
      }
      const capexFor = (categoria: string, costiCode: 'NUOVA_REALIZZAZIONE' | 'RISTRUTTURAZIONE', qty: number): number => {
        const recs = getCostiByCategory(categoria)
        if (recs.length === 0) return 0
        const costo = calcolaCostoTipologia(recs[0], costiCode)
        return costo ? Math.round(costo.val_med * qty) : 0
      }
      // Parametri pre-elaborati (vita utile, durata cantiere, quota OPEX) ricavati
      // dalla categoria, così l'autoriempi compila l'intera pagina dei parametri
      // dell'alternativa (la validazione richiede tutti i campi, non solo il CAPEX).
      const paramsFor = (categoria: string, tipologia: string, capex: number) => {
        const cat = INTERVENTION_CATEGORIES.find((c) => c.code === categoria)
        const vitaUtileProgram = cat?.useful_life?.find((u) => u.tipologia_code === tipologia)?.years ?? 20
        const durataStimata = cat?.construction_durations?.find((d) => d.tipologia_code === tipologia)?.duration_months ?? 12
        const opexPct = cat?.opex?.pct_med ?? 0.05
        return { vitaUtileProgram, durataStimata, opex: Math.round(capex * opexPct) }
      }
      const fillAlternativaSetup = (altId: SupportedAlternativaId) => {
        const { categoria, clusterId } = resolveCategoria()
        const p = ALT_PRESET[altId]
        const capex = capexFor(categoria, p.costiCode, p.quantita)
        const { vitaUtileProgram, durataStimata, opex } = paramsFor(categoria, p.tipologia, capex)
        const cur = state.alternative[altId] ?? {}
        addAlternativa(altId, {
          ...cur,
          categoria,
          tipologia: p.tipologia,
          quantita: p.quantita,
          obiettivoCer: p.obiettivoCer,
          capex,
          opex,
          vitaUtileProgram,
          durataStimata,
          nome: (cur as { nome?: string }).nome || p.nome,
          clusterId,
          unitaMisura: 'posti',
        } as never)
        if (altId === 'A1') setCluster(clusterId)
      }
      const fillAlternativaNome = (altId: SupportedAlternativaId) => {
        const cur = state.alternative[altId] ?? {}
        addAlternativa(altId, { ...cur, nome: ALT_PRESET[altId].nome } as never)
      }

      switch (subStepId) {
        // Fase 1 · Inquadramento ------------------------------------------
        case 'fase1-ente':
          setRup({ nome: 'Marco Bianchi', qualifica: 'RUP', email: 'marco.bianchi@comune.colleferro.rm.it' })
          return
        case 'fase1-fabbisogno':
          // FAB-51 = "Offerta insufficiente di posti nido (0-3 anni)" · cluster C03
          setFab('FAB-51', 'TC03')
          setCluster('C03')
          return

        // Fase 2 · Bisogno ------------------------------------------------
        case 'fase2-problema':
          setProblema({
            descrizione:
              'Carenza di posti negli asili nido comunali: la domanda di servizi educativi 0-3 anni supera ampiamente l’offerta attuale, con un gap stimato di 178 posti e lunghe liste di attesa.',
            documentato: 'si',
          })
          setUrgenza('Breve termine (1-3 anni)')
          return
        case 'fase2-sz-questions':
          setScenarioZeroAnswers({
            'DC-SZ-051-01': 'lista_attesa',
            'DC-SZ-051-02': ['occupazione_femminile', 'costi_privati'],
          })
          setScenarioZeroNarrative(
            "Il servizio educativo 0-3 è presente e funzionante, ma le liste d'attesa sono lunghe, con una quota significativa di domande che non trovano risposta nell'offerta disponibile. Si registra inoltre un tasso di occupazione femminile inferiore alla media, correlato alla mancanza di servizi di cura per la prima infanzia, e famiglie che ricorrono a soluzioni private a costi elevati.",
          )
          return
        case 'fase2-q1':
          setQ1Value(178)
          return

        // Fase 3 · Alternative -------------------------------------------
        case 'fase3-aggiunta':
          setAlternativeDefinite(['A1', 'A2'])
          fillAlternativaSetup('A1')
          fillAlternativaSetup('A2')
          setAlternativeAggiuntaCompletata(true)
          prefillPOCAnswers('C03', ['A1', 'A2'])
          return

        // Fase 4 · Analisi Multicriteria ---------------------------------
        case 'fase4-mca': {
          const clusterIds = state.clusterId ? [state.clusterId] : []
          const questions = getMatrixQuestions(clusterIds)
          const altIds = state.alternativeDefinite.filter(isSupportedAlternativaId)
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
          return
        }

        default: {
          // Substep dinamici per singola alternativa (fase 3): riempie quella alternativa.
          const m = subStepId.match(/^fase3-(a[123])-(setup|params|nome)$/)
          if (m) {
            const altId = m[1].toUpperCase() as SupportedAlternativaId
            // fillAlternativaSetup imposta categoria, tipologia E nome in un'unica
            // addAlternativa: NON chiamare anche fillAlternativaNome, che leggendo
            // lo stato vecchio dalla closure sovrascriverebbe (azzerando) categoria/tipologia.
            fillAlternativaSetup(altId)
            // Nella pagina dei parametri: segnala l'autoriempi così i 4 box
            // (durata, vita utile, CAPEX, OPEX) si bloccano tutti come confermati.
            if (m[2] === 'params') bumpAutofill()
          }
          return
        }
      }
    },
    [setRup, setFab, setCluster, setProblema, setUrgenza, setScenarioZeroAnswers, setScenarioZeroNarrative, setAlternativeDefinite, addAlternativa, setAlternativeAggiuntaCompletata, setMcaScores, prefillPOCAnswers, bumpAutofill, state.clusterId, state.alternativeDefinite, state.fabId, state.temaId, state.alternative],
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
              subtitle: "Seleziona categoria e tipologia, poi assegna un nome all'alternativa.",
              normRef: 'Art. 2, c.4, c)',
              bare: true,
              content: <Step3_AlternativaSetup alternativaId={alternativaId} />,
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
              bare: true,
              content: <InputParamsStep alternativaId={alternativaId} />,
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
            id: 'fase1-fabbisogno',
            title: 'Fabbisogno',
            questions: [
              {
                title: 'Quale fabbisogno deve soddisfare il progetto?',
                subtitle: 'Seleziona prima il macro tema oppure cerca direttamente il fabbisogno specifico.',
                normRef: 'Art. 2, c.2',
                bare: true,
                content: <Step1_3_FabbisognoTema />,
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
                bare: true,
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
                bare: true,
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
                subtitle: 'Valuta le alternative su criteri qualitativi.',
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
                bare: true,
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
      onAutofill={autoFillPage}
      autofillPhaseIndexes={[1, 2, 3, 4]}
    />
  )
}
