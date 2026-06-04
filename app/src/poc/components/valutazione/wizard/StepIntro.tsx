import type { CSSProperties } from 'react'
import { WizardSectionCard, WizardStepHeader } from './primitives'

type IntroSection = {
  title: string
  items: string[]
  footnote?: string
}

const INTRO_SECTIONS: IntroSection[] = [
  {
    title: 'In cosa consiste',
    items: [
      'Identificare il progetto e il suo perimetro valutativo.',
      'Classificare settore, categoria e tipo di intervento.',
      'Definire localizzazione, durata e parametri economici.',
      'Preparare il progetto alle analisi di impatto, costi-benefici ed ESG.',
    ],
    footnote: 'Puoi creare un progetto anche senza eseguire subito tutte le analisi.',
  },
  {
    title: 'Perché è importante',
    items: [
      'Rende più leggibili e comparabili le scelte amministrative.',
      'Aiuta ad allineare il progetto con DUP, PIAO, SDGs e altri strumenti di programmazione.',
      'Supporta la costruzione di evidenze utili per finanziamenti e istruttorie.',
      'Migliora trasparenza e responsabilità verso cittadini e stakeholder.',
    ],
  },
  {
    title: 'Suggerimenti per la compilazione',
    items: [
      'Inserisci dati aderenti al contesto reale, anche se inizialmente incompleti.',
      'Completa il percorso in sequenza per ottenere una configurazione coerente.',
      'Potrai tornare sui passaggi successivamente senza perdere il lavoro già inserito.',
      'Controlla con attenzione localizzazioni e parametri economici prima di chiudere il wizard.',
    ],
  },
]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 7.2l2.2 2.2L11 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StepIntro() {
  return (
    <div style={rootStyle}>
      <WizardStepHeader
        title="Valutazione"
        description="La valutazione rappresenta il punto di partenza del progetto e raccoglie le informazioni necessarie per attivare i percorsi di analisi più adatti. In questa configurazione prepari il contenitore che ospiterà analisi di impatto, costi-benefici ed ESG."
        centered
      />

      <div style={cardsGridStyle}>
        {INTRO_SECTIONS.map((section) => (
          <WizardSectionCard key={section.title} title={section.title} accentTop>
            <ul style={listStyle}>
              {section.items.map((item) => (
                <li key={item} style={listItemStyle}>
                  <span aria-hidden="true" style={bulletStyle}>
                    <CheckIcon />
                  </span>
                  <span style={itemTextStyle}>{item}</span>
                </li>
              ))}
            </ul>
            {section.footnote ? <p style={footnoteStyle}>{section.footnote}</p> : null}
          </WizardSectionCard>
        ))}
      </div>
    </div>
  )
}

const cardsGridStyle: CSSProperties = {
  display: 'grid',
  width: '100%',
  maxWidth: '1360px',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 'clamp(24px, 2.4vw, 40px)',
  alignItems: 'stretch',
}

const rootStyle: CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 'clamp(28px, 3vh, 40px)',
  justifyItems: 'center',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const listStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const listItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr)',
  gap: 'var(--spacing-inline-xs)',
  alignItems: 'start',
}

const bulletStyle: CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: 'var(--radius-circle)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const itemTextStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  lineHeight: '1.4',
}

const footnoteStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}
