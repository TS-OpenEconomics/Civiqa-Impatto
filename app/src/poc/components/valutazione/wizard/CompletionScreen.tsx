import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { AnalysisType } from '../../../data/mockValutazione'
import { CompletionAnalysisModal } from './CompletionAnalysisModal'

type CompletionAction =
  | { kind: 'project' }
  | { kind: 'analysis'; analyses: AnalysisType[] }

interface Props {
  onComplete: (action: CompletionAction) => void
}

type PrimaryChoice = 'EIA' | 'ECBA' | 'ESG'

function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CompletionCheckIllustration() {
  return (
    <div style={illustrationWrapStyle} aria-hidden="true">
      <div style={illustrationTrackStyle} />
      <div style={illustrationStartStyle} />
      <div style={illustrationEndStyle}>
        <svg width="36" height="36" viewBox="0 0 54 54" fill="none">
          <path d="M16 27.5l7.5 7.5L38.5 20" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {confettiPieces.map((piece, index) => (
        <span key={index} style={{ ...confettiStyle, ...piece }} />
      ))}
    </div>
  )
}

function IconImpact() {
  return (
    <svg width="64" height="64" viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <circle cx="42" cy="44" r="26" stroke="var(--color-background-primary)" strokeWidth="4" />
      <circle cx="42" cy="44" r="15" stroke="var(--color-background-primary)" strokeWidth="4" opacity="0.5" />
      <path d="M41.5 17v23l17-17" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="42" cy="44" r="4.5" fill="var(--color-background-primary)" />
    </svg>
  )
}

function IconCba() {
  return (
    <svg width="64" height="64" viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <path d="M44 18v45" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 28h36" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="44" cy="24" r="5" stroke="var(--color-background-primary)" strokeWidth="4" />
      <path d="M30 32l-9 18h18l-9-18z" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M58 32l-9 18h18l-9-18z" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M36 62h16" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function IconEsg() {
  return (
    <svg width="64" height="64" viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <circle cx="44" cy="20" r="12" stroke="var(--color-background-primary)" strokeWidth="4" />
      <circle cx="25" cy="55" r="12" stroke="var(--color-background-primary)" strokeWidth="4" />
      <circle cx="63" cy="55" r="12" stroke="var(--color-background-primary)" strokeWidth="4" />
      <path d="M38 30L30 43" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 30l8 13" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M37 55h14" stroke="var(--color-background-primary)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function AnalysisCard({
  title,
  description,
  accent,
  icon,
  onClick,
}: {
  title: string
  description: string
  accent: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <article style={analysisCardStyle}>
      <div style={{ ...analysisCardAccentStyle, background: accent }} />
      <div style={analysisCardBodyStyle}>
        <div style={analysisCardIconWrapStyle}>{icon}</div>
        <h3 style={analysisCardTitleStyle}>{title}</h3>
        <p style={analysisCardDescriptionStyle}>{description}</p>
      </div>
      <button type="button" onClick={onClick} style={analysisCardActionStyle}>
        <span>Esegui</span>
        <IconArrowRight />
      </button>
    </article>
  )
}

export function CompletionScreen({ onComplete }: Props) {
  const [multiAnalysisChoice, setMultiAnalysisChoice] = useState<'EIA' | 'ECBA' | null>(null)

  const analysisCards = useMemo(
    () => [
      {
        id: 'EIA' as const,
        title: "Analisi di impatto",
        description: 'per stimare gli effetti del progetto su economia locale, occupazione e sviluppo del territorio.',
        accent: '#f46ef5',
        icon: <IconImpact />,
      },
      {
        id: 'ECBA' as const,
        title: 'Analisi Costi-Benefici',
        description: 'per valutare il rapporto tra costi e benefici del progetto, misurandone la convenienza complessiva per la collettività.',
        accent: '#c6c9ff',
        icon: <IconCba />,
      },
      {
        id: 'ESG' as const,
        title: 'Analisi ESG',
        description: 'per valutare la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance.',
        accent: '#70ecf0',
        icon: <IconEsg />,
      },
    ],
    [],
  )

  const handleAnalysisClick = (choice: PrimaryChoice) => {
    if (choice === 'ESG') {
      onComplete({ kind: 'analysis', analyses: ['ESG'] })
      return
    }
    setMultiAnalysisChoice(choice)
  }

  const handleSingleAnalysis = () => {
    if (!multiAnalysisChoice) return
    onComplete({ kind: 'analysis', analyses: [multiAnalysisChoice] })
  }

  const handleDualAnalysis = () => {
    onComplete({ kind: 'analysis', analyses: ['EIA', 'ECBA'] })
  }

  return (
    <div style={rootStyle}>
      <section style={heroSectionStyle}>
        <CompletionCheckIllustration />

        <div style={heroTextWrapStyle}>
          <h1 style={heroTitleStyle}>Abbiamo finito! La tua configurazione è completata</h1>
          <p style={heroDescriptionStyle}>
            Nella pagina di dettaglio del progetto troverai tutte le informazioni inserite in fase di configurazione,
            con la possibilità di modificarle o aggiornarle.
          </p>
          <p style={heroDescriptionStyle}>
            Potrai anche avviare Analisi di Impatto (EIA), Analisi Costi-Benefici (ECBA) e Analisi ESG, oppure caricare
            e allegare documenti tecnici, normativi o di supporto.
          </p>
          <button type="button" onClick={() => onComplete({ kind: 'project' })} style={projectLinkStyle}>
            <span>Vai all’ambiente di progetto</span>
            <IconArrowRight />
          </button>
        </div>
      </section>

      <section style={analysisSectionStyle}>
        <div style={patternOverlayStyle} aria-hidden="true" />
        <div style={analysisInnerStyle}>
          <p style={analysisEyebrowStyle}>Oppure</p>
          <h2 style={analysisSectionTitleStyle}>Esegui subito un’analisi</h2>

          <div style={analysisGridStyle}>
            {analysisCards.map((card) => (
              <AnalysisCard
                key={card.id}
                title={card.title}
                description={card.description}
                accent={card.accent}
                icon={card.icon}
                onClick={() => handleAnalysisClick(card.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {multiAnalysisChoice ? (
        <CompletionAnalysisModal
          choice={multiAnalysisChoice}
          onClose={() => setMultiAnalysisChoice(null)}
          onSingle={handleSingleAnalysis}
          onDual={handleDualAnalysis}
        />
      ) : null}
    </div>
  )
}

const confettiPieces: CSSProperties[] = [
  { top: '8px', right: '108px', transform: 'rotate(34deg)', background: '#f6c8cf' },
  { top: '20px', right: '72px', transform: 'rotate(16deg)', background: '#c3f1a0' },
  { top: '54px', right: '52px', transform: 'rotate(24deg)', background: '#f6c8cf' },
  { top: '84px', right: '82px', transform: 'rotate(18deg)', background: '#e6dcff' },
  { top: '88px', right: '128px', transform: 'rotate(4deg)', background: '#c3f1a0' },
  { top: '48px', right: '148px', transform: 'rotate(-34deg)', background: '#d9d0ff' },
]

const rootStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'var(--color-background-secondary-light)',
  overflowY: 'auto',
}

const heroSectionStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  display: 'grid',
  justifyItems: 'center',
  padding: '22px 24px 34px',
}

const illustrationWrapStyle: CSSProperties = {
  position: 'relative',
  width: '260px',
  height: '110px',
}

const illustrationTrackStyle: CSSProperties = {
  position: 'absolute',
  left: '66px',
  top: '46px',
  width: '116px',
  height: '6px',
  background: '#efefef',
}

const illustrationStartStyle: CSSProperties = {
  position: 'absolute',
  left: '34px',
  top: '20px',
  width: '68px',
  height: '68px',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 32% 28%, #fbfbfb 0%, #ededed 65%, #f7f7f7 100%)',
}

const illustrationEndStyle: CSSProperties = {
  position: 'absolute',
  left: '190px',
  top: '18px',
  width: '72px',
  height: '72px',
  marginLeft: '-36px',
  borderRadius: '50%',
  background: 'linear-gradient(145deg, #6d28ff 12%, #5a19d9 48%, #7d31ff 100%)',
  display: 'grid',
  placeItems: 'center',
  boxShadow: '0 10px 26px rgba(78, 19, 203, 0.2)',
}

const confettiStyle: CSSProperties = {
  position: 'absolute',
  width: '6px',
  height: '12px',
  borderRadius: '2px',
}

const heroTextWrapStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  gap: '12px',
  maxWidth: '840px',
  textAlign: 'center',
}

const heroTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '34px',
  lineHeight: 1.12,
  fontWeight: 700,
}

const heroDescriptionStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '14px',
  lineHeight: 1.45,
  maxWidth: '760px',
}

const projectLinkStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-secondary)',
  fontSize: '16px',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  padding: 0,
  marginTop: '4px',
}

const analysisSectionStyle: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  background: '#ececec',
  padding: '26px 24px 40px',
}

const patternOverlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  opacity: 0.38,
  backgroundImage:
    'radial-gradient(circle at 14px 14px, rgba(255,255,255,0.9) 0 14px, transparent 15px), radial-gradient(circle at 14px 14px, rgba(0,0,0,0) 0 14px, transparent 15px)',
  backgroundSize: '110px 72px',
  backgroundPosition: '0 0, 56px 36px',
}

const analysisInnerStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '920px',
  margin: '0 auto',
  display: 'grid',
  justifyItems: 'center',
  gap: '8px',
}

const analysisEyebrowStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '12px',
}

const analysisSectionTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '20px',
  fontWeight: 700,
}

const analysisGridStyle: CSSProperties = {
  marginTop: '10px',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '18px',
}

const analysisCardStyle: CSSProperties = {
  display: 'grid',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  background: 'var(--color-background-inverse)',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
}

const analysisCardAccentStyle: CSSProperties = {
  height: '6px',
}

const analysisCardBodyStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'start',
  gap: '12px',
  padding: '24px 22px 20px',
  minHeight: '206px',
  textAlign: 'center',
}

const analysisCardIconWrapStyle: CSSProperties = {
  minHeight: '74px',
  display: 'grid',
  placeItems: 'center',
}

const analysisCardTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '16px',
  fontWeight: 700,
}

const analysisCardDescriptionStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '13px',
  lineHeight: 1.4,
}

const analysisCardActionStyle: CSSProperties = {
  minHeight: '42px',
  border: 'none',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  padding: '0 14px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 600,
}
