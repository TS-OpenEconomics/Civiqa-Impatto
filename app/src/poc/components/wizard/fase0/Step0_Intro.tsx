import type { CSSProperties } from 'react'

type IntroSection = {
  title: string
  items: string[]
}

const INTRO_SECTIONS: IntroSection[] = [
  {
    title: 'In cosa consiste',
    items: [
      'Definire il fabbisogno pubblico da soddisfare con il DOCFAP',
      'Inquadrare il contesto dell’intervento e gli obiettivi dell’ente',
      'Raccogliere i dati utili a confrontare le alternative progettuali',
      'Impostare un percorso strutturato verso la soluzione più coerente',
    ],
  },
  {
    title: 'Perché è importante',
    items: [
      'Supporta decisioni progettuali motivate, trasparenti e documentabili',
      'Aiuta a confrontare le alternative in modo ordinato e leggibile',
      'Rafforza la coerenza tra bisogni, vincoli, priorità e mandato dell’ente',
      'Crea una base istruttoria solida per le fasi successive del DOCFAP',
    ],
  },
  {
    title: 'Suggerimenti per la compilazione',
    items: [
      'Inserisci informazioni quanto più possibile aderenti al contesto reale',
      'Compila il wizard seguendo i passaggi in sequenza',
      'Se alcuni dati non sono ancora disponibili, salva ciò che hai e aggiorna in seguito',
      'Verifica con attenzione le alternative considerate e gli elementi di confronto',
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

export function Step0_Intro() {
  return (
    <div style={rootStyle}>
      <div style={cardsGridStyle}>
        {INTRO_SECTIONS.map((section) => (
          <article key={section.title} style={cardStyle}>
            <h3 style={cardTitleStyle}>{section.title}</h3>
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
          </article>
        ))}
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  width: '100%',
}

const cardsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 'clamp(24px, 2.4vw, 40px)',
  alignItems: 'stretch',
}

const cardStyle: CSSProperties = {
  minHeight: '440px',
  padding: '30px 28px 32px',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-secondary-light)',
  borderTop: '4px solid var(--color-background-primary)',
  background: 'var(--color-background-inverse)',
  display: 'grid',
  gap: 'var(--spacing-stack-l)',
}

const cardTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-heading-s-size, 22px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  lineHeight: '1.2',
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
  borderRadius: '50%',
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
