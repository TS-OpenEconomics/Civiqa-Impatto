import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import type { CbaBenefitSeriesInput } from '../../../contexts/ValutazioneWizardContext'
import { getCbaKpiCatalog } from '../../../data/cba/kpiCatalog'
import {
  applyEstimatedValuesToAllYears,
  buildInitialCbaKpiReviewState,
  clearCbaKpiDistribution,
  isCbaKpiDistributionComplete,
  mapCbaKpiDistributionToBenefitSeries,
} from './cbaKpiReview'

interface Props {
  onClose: () => void
  onSubmit: (payload: CbaBenefitSeriesInput[]) => void
}

function IconAutoFill() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 3.5h8M2 8h5M2 12.5h8M11.5 3.5H14M9.5 8H14M11.5 12.5H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 1.75v3.5M9.5 6.25v3.5M11.5 10.75v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getSectionRows(rowIds: string[], allRows: ReturnType<typeof useValutazioneWizard>['state']['cba_kpi_rows']) {
  return rowIds
    .map((rowId) => allRows.find((row) => row.id === rowId))
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
}

function formatCurrency(value: number): string {
  return value.toLocaleString('it-IT')
}

function normalizeInputValue(raw: string): string {
  return raw.replace(/[^\d.,-]/g, '')
}

export function CbaKpiReviewPage({ onClose, onSubmit }: Props) {
  const { state, setState } = useValutazioneWizard()

  useEffect(() => {
    if (state.cba_kpi_years.length > 0 && state.cba_kpi_rows.length > 0) return
    const initial = buildInitialCbaKpiReviewState(state)
    setState({
      cba_kpi_years: initial.years,
      cba_kpi_rows: initial.rows,
      cba_kpi_distribution: initial.distribution,
      cba_kpi_last_mode: initial.lastMode,
    })
  }, [setState, state])

  const years = state.cba_kpi_years
  const rows = state.cba_kpi_rows
  const distribution = state.cba_kpi_distribution
  const sections = getCbaKpiCatalog()
  const isComplete = years.length > 0 && rows.length > 0 && isCbaKpiDistributionComplete(rows, years, distribution)

  const handleDistributeAll = () => {
    setState({
      cba_kpi_distribution: applyEstimatedValuesToAllYears(rows, years),
      cba_kpi_last_mode: 'auto',
    })
  }

  const handleClear = () => {
    setState({
      cba_kpi_distribution: clearCbaKpiDistribution(rows, years),
      cba_kpi_last_mode: null,
    })
  }

  const handleCellChange = (rowId: string, year: number, value: string) => {
    setState({
      cba_kpi_distribution: {
        ...distribution,
        [rowId]: {
          ...distribution[rowId],
          [year]: normalizeInputValue(value),
        },
      },
      cba_kpi_last_mode: 'manual',
    })
  }

  const handleSubmit = () => {
    if (!isComplete) return
    onSubmit(mapCbaKpiDistributionToBenefitSeries(rows, years, distribution))
  }

  return (
    <div style={rootStyle}>
      <header style={headerStyle}>
        <button type="button" onClick={onClose} style={closeActionStyle}>
          Chiudi e torna alla scheda progetto
        </button>
      </header>

      <div style={accentLineStyle} aria-hidden="true" />

      <main style={mainStyle}>
        <section style={heroStyle}>
          <h1 style={titleStyle}>Verifica gli indicatori stimati per il progetto</h1>
          <p style={descriptionStyle}>
            Ti presentiamo una stima dei principali KPI ambientali, economici e sociali associati al tuo progetto,
            elaborata a partire da open data e linee guida di settore. Il valore “Stima anno” è suggerito, non
            obbligatorio: se non ti soddisfacesse, puoi inserire tu un valore autonomamente.
          </p>
        </section>

        <section style={toolbarWrapStyle}>
          <button type="button" onClick={handleDistributeAll} style={primaryToolbarActionStyle}>
            <IconAutoFill />
            <span>Inserisci automaticamente sugli anni</span>
          </button>

          <button type="button" onClick={handleClear} style={secondaryToolbarActionStyle}>
            <span>Pulisci la distribuzione</span>
            <IconTrash />
          </button>
        </section>

        <section style={tableFrameStyle}>
          <div style={tableScrollStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...tableHeaderCellStyle, ...stickyColumnStyle, left: 0, minWidth: '260px' }}>KPI</th>
                  <th style={{ ...tableHeaderCellStyle, ...stickyColumnStyle, left: '260px', minWidth: '180px' }}>Stima anno</th>
                  {years.map((year) => (
                    <th key={year} style={yearHeaderCellStyle}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => {
                  const sectionRows = getSectionRows(
                    section.rows.map((row) => row.id),
                    rows,
                  )

                  return (
                    sectionRows.length > 0
                      ? [
                          <tr key={`${section.id}-header`}>
                            <th colSpan={years.length + 2} style={sectionRowStyle}>{section.title}</th>
                          </tr>,
                          ...sectionRows.map((row) => (
                            <tr key={row.id}>
                              <th style={{ ...labelCellStyle, ...stickyBodyCellStyle, left: 0 }}>{row.label}</th>
                              <td style={{ ...estimateCellStyle, ...stickyBodyCellStyle, left: '260px' }}>
                                {formatCurrency(row.estimated_annual_value)} €
                              </td>
                              {years.map((year) => (
                                <td key={`${row.id}-${year}`} style={valueCellWrapStyle}>
                                  <div style={valueCellInnerStyle}>
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      value={distribution[row.id]?.[year] ?? ''}
                                      onChange={(event) => handleCellChange(row.id, year, event.target.value)}
                                      aria-label={`${row.label} ${year}`}
                                      style={valueInputStyle}
                                    />
                                    <span style={currencySuffixStyle}>€</span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          )),
                        ]
                      : null
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {!isComplete ? (
          <p style={validationTextStyle}>
            Completa tutte le celle annuali dei KPI per abilitare l’esecuzione dell’analisi.
          </p>
        ) : null}
      </main>

      <footer style={footerStyle}>
        <div />
        <button type="button" onClick={handleSubmit} disabled={!isComplete} style={{ ...submitButtonStyle, ...(!isComplete ? submitButtonDisabledStyle : null) }}>
          <span>Esegui l'analisi</span>
          <IconArrowRight />
        </button>
      </footer>
    </div>
  )
}

const rootStyle: CSSProperties = {
  minHeight: '100vh',
  background: '#f3f3f3',
  display: 'grid',
  gridTemplateRows: 'auto 4px minmax(0, 1fr) auto',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  minHeight: '60px',
  padding: '0 32px',
  background: '#ffffff',
}

const closeActionStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-secondary)',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0,
}

const accentLineStyle: CSSProperties = {
  background: 'var(--color-background-accent)',
}

const mainStyle: CSSProperties = {
  padding: '32px 40px 92px',
  overflow: 'auto',
  display: 'grid',
  gap: '24px',
}

const heroStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  maxWidth: '1080px',
  margin: '0 auto',
  width: '100%',
}

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '44px',
  lineHeight: 1.04,
  fontWeight: 700,
}

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '16px',
  lineHeight: 1.55,
}

const toolbarWrapStyle: CSSProperties = {
  maxWidth: '1080px',
  width: '100%',
  margin: '0 auto',
  padding: '16px 18px',
  background: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  alignItems: 'center',
  flexWrap: 'wrap',
}

const primaryToolbarActionStyle: CSSProperties = {
  minHeight: '56px',
  border: 'none',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  padding: '0 16px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
}

const secondaryToolbarActionStyle: CSSProperties = {
  minHeight: '56px',
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-error)',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
}

const tableFrameStyle: CSSProperties = {
  maxWidth: '1080px',
  width: '100%',
  margin: '0 auto',
  background: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
}

const tableScrollStyle: CSSProperties = {
  overflowX: 'auto',
}

const tableStyle: CSSProperties = {
  width: '100%',
  minWidth: '1840px',
  borderCollapse: 'separate',
  borderSpacing: 0,
}

const tableHeaderCellStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 3,
  background: '#ffffff',
  borderBottom: '4px solid #0f0f0f',
  padding: '18px 16px',
  textAlign: 'left',
  color: 'var(--color-text-primary)',
  fontSize: '14px',
  fontWeight: 700,
}

const yearHeaderCellStyle: CSSProperties = {
  ...tableHeaderCellStyle,
  minWidth: '164px',
  background: '#595959',
  color: '#ffffff',
  textAlign: 'center',
  borderBottomColor: '#0f0f0f',
}

const stickyColumnStyle: CSSProperties = {
  position: 'sticky',
  zIndex: 4,
}

const sectionRowStyle: CSSProperties = {
  padding: '14px 16px',
  background: '#ffffff',
  color: 'var(--color-text-primary)',
  fontSize: '14px',
  fontWeight: 700,
  textAlign: 'left',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}

const stickyBodyCellStyle: CSSProperties = {
  position: 'sticky',
  background: '#ffffff',
  zIndex: 2,
}

const labelCellStyle: CSSProperties = {
  minWidth: '260px',
  padding: '14px 16px',
  textAlign: 'left',
  color: 'var(--color-text-primary)',
  fontWeight: 500,
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}

const estimateCellStyle: CSSProperties = {
  minWidth: '180px',
  padding: '14px 16px',
  textAlign: 'right',
  color: 'var(--color-text-primary-light)',
  fontVariantNumeric: 'tabular-nums',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}

const valueCellWrapStyle: CSSProperties = {
  minWidth: '164px',
  padding: '8px 10px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}

const valueCellInnerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const valueInputStyle: CSSProperties = {
  width: '100%',
  minHeight: '40px',
  border: '1px solid rgba(0, 0, 0, 0.24)',
  padding: '0 10px',
  fontSize: '14px',
  fontVariantNumeric: 'tabular-nums',
}

const currencySuffixStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontWeight: 600,
}

const validationTextStyle: CSSProperties = {
  maxWidth: '1080px',
  width: '100%',
  margin: '0 auto',
  color: 'var(--color-text-error)',
  fontSize: '14px',
}

const footerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 560px',
  minHeight: '60px',
}

const submitButtonStyle: CSSProperties = {
  border: 'none',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  padding: '0 28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
}

const submitButtonDisabledStyle: CSSProperties = {
  cursor: 'default',
  background: 'var(--color-background-disable)',
  color: 'var(--color-text-disable)',
}
