import { useMemo } from 'react'
import { useWizard } from '../../hooks/useWizard'
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
  const { state } = useWizard()
  const supportedAlternativeIds = useMemo(
    () => state.alternativeDefinite.filter(isSupportedAlternativaId),
    [state.alternativeDefinite],
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

  return <WizardShell phases={phases} onClose={onClose} />
}
