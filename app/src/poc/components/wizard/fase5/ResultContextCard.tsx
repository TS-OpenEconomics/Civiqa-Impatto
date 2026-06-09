// src/components/wizard/fase5/ResultContextCard.tsx
import type { CSSProperties } from 'react'
import { FABBISOGNI } from '../../../data/taxonomy/fabbisogni'
import type { AlternativaId, AlternativaData } from '../../../types/docfap'
import { fmtEur } from './resultUtils'

interface Props {
  rupNome: string
  fabId: string | null
  temaId: string | null
  alternativeDefinite: AlternativaId[]
  alternative: Record<AlternativaId, AlternativaData | null>
  getLabel: (id: AlternativaId) => string
}

export function ResultContextCard({ rupNome, fabId, temaId, alternativeDefinite, alternative, getLabel }: Props) {
  const fab = FABBISOGNI.find(f => f.id === fabId)
  const temaLabel = fab?.temaLabel ?? temaId ?? '—'
  const fabLabel = fab ? `${fab.id} · ${fab.label}` : (fabId ?? '—')

  return (
    <div style={wrapStyle}>
      <div style={headerStyle}>
        Dati della configurazione
      </div>
      <div style={metaGridStyle}>
        <div style={metaCellStyle}>
          <div style={metaLabelStyle}>Responsabile Unico del Procedimento</div>
          <div style={metaValueAccentStyle}>{rupNome || '—'}</div>
        </div>
        <div style={metaCellStyle}>
          <div style={metaLabelStyle}>Tema del fabbisogno</div>
          <div style={metaValueStyle}>{temaLabel}</div>
        </div>
        <div style={{ ...metaCellStyle, borderRight: 'none' }}>
          <div style={metaLabelStyle}>Fabbisogno specifico</div>
          <div style={metaValueStyle}>{fabLabel}</div>
        </div>
      </div>
      <div style={altGridStyle}>
        {alternativeDefinite.map((id, i) => {
          const alt = alternative[id]
          const durata = alt?.durataStimata ?? alt?.vitaUtileProgram ?? null
          return (
            <div
              key={id}
              style={{ ...altCellStyle, borderRight: i === alternativeDefinite.length - 1 ? 'none' : altCellStyle.borderRight }}
            >
              <div style={altTitleStyle}>{id} · {getLabel(id)}</div>
              <div style={altRowStyle}><span>CAPEX</span><strong style={altValueStyle}>{fmtEur(alt?.capex ?? 0)}</strong></div>
              <div style={altRowStyle}><span>OPEX/anno</span><strong style={altValueStyle}>{fmtEur(alt?.opex ?? 0)}</strong></div>
              <div style={altRowStyle}><span>Durata</span><strong style={altValueStyle}>{durata != null ? `${durata} anni` : '—'}</strong></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const wrapStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary, #545454)',
  borderRadius: 'var(--radius-smooth)',
  overflow: 'hidden',
  marginBottom: '0',
}

const headerStyle: CSSProperties = {
  background: '#1a1a1a',
  color: '#ffffff',
  padding: '12px 20px',
  fontSize: '13px',
  fontWeight: 700,
}

const metaGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  background: 'var(--color-background-inverse)',
}

const metaCellStyle: CSSProperties = {
  padding: '14px 20px',
  borderRight: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
}

const metaLabelStyle: CSSProperties = {
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '.5px',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  marginBottom: '3px',
  fontWeight: 700,
}

const metaValueStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

const metaValueAccentStyle: CSSProperties = {
  ...metaValueStyle,
  color: 'var(--color-background-primary, #5B21F7)',
}

const altGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  background: 'var(--color-background-inverse)',
}

const altCellStyle: CSSProperties = {
  padding: '14px 20px',
  borderRight: '1px solid var(--color-border-secondary-light, #e7e7e7)',
}

const altTitleStyle: CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  color: 'var(--color-background-primary, #5B21F7)',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const altRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
  fontSize: '11px',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  marginBottom: '3px',
}

const altValueStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
}
