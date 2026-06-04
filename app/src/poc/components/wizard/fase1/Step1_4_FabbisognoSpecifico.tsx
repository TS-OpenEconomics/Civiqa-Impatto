import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'

const TEMA_LABELS: Record<string, string> = {
  TC01: 'Cultura e turismo',
  TC02: 'Economia e lavoro',
  TC03: 'Istruzione e formazione',
  TC04: 'Welfare e inclusione',
  TC05: 'Salute e sanità',
  TC06: 'Ambiente e territorio',
  TC07: 'Mobilità e trasporti',
  TC08: 'Patrimonio pubblico',
  TC09: 'Energia e clima',
  TC10: 'Sport e tempo libero',
  TC11: 'Ricerca e innovazione',
  TC12: 'PA e innovazione',
}

export function Step1_4_FabbisognoSpecifico() {
  const { state, setFab, setCluster } = useWizard()

  const themeLabel = state.temaId ? (TEMA_LABELS[state.temaId] ?? state.temaId) : null

  const needsByTheme = useMemo(() => {
    if (!state.temaId) return []
    return NEEDS_DOCFAP.filter((n) => n.tema_code === state.temaId)
  }, [state.temaId])

  const selectedNeed = useMemo(
    () => NEEDS_DOCFAP.find((n) => n.code === state.fabId) ?? null,
    [state.fabId],
  )

  const onSelectFabbisogno = (code: string) => {
    const need = NEEDS_DOCFAP.find((n) => n.code === code)
    if (!need) return
    setFab(need.code, need.tema_code)
    setCluster(need.cluster_mca === 'NONE' ? null : need.cluster_mca)
  }

  const isThemeSelected = Boolean(state.temaId)

  return (
    <div style={rootStyle}>
      <section style={sectionStyle}>
        <p style={sectionHintStyle}>
          {themeLabel
            ? `Tema selezionato: ${themeLabel}`
            : 'Seleziona prima un tema per attivare la lista dei fabbisogni.'}
        </p>

        <div aria-disabled={!isThemeSelected} style={isThemeSelected ? undefined : disabledBlockStyle}>
          <div
            role="listbox"
            aria-label="Lista fabbisogni del tema selezionato"
            aria-activedescendant={state.fabId ? `fab-option-${state.fabId}` : undefined}
            style={listStyle}
          >
            {needsByTheme.map((need) => {
              const isSelected = state.fabId === need.code

              return (
                <button
                  key={need.code}
                  id={`fab-option-${need.code}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`step1-4-interactive${isSelected ? ' step1-4-selected' : ''}`}
                  onClick={() => onSelectFabbisogno(need.code)}
                  style={isSelected ? { ...listOptionStyle, ...selectedListOptionStyle } : listOptionStyle}
                >
                  <span style={listOptionLabelStyle}>{need.label}</span>
                  <span style={listOptionSubLabelStyle}>{need.description}</span>
                </button>
              )
            })}

            {isThemeSelected && needsByTheme.length === 0 && (
              <p style={emptyStateStyle}>Nessun fabbisogno disponibile per il tema selezionato.</p>
            )}
          </div>
        </div>
      </section>

      <section aria-live="polite" style={detailsBoxStyle}>
        <h3 style={detailsTitleStyle}>Dettagli fabbisogno selezionato</h3>

        {selectedNeed ? (
          <dl style={detailsListStyle}>
            <div style={detailsRowStyle}>
              <dt style={detailsTermStyle}>Descrizione</dt>
              <dd style={detailsValueStyle}>{selectedNeed.description}</dd>
            </div>

            {selectedNeed.missions.length > 0 && (
              <div style={detailsRowStyle}>
                <dt style={detailsTermStyle}>Missioni DUP</dt>
                <dd style={detailsValueStyle}>
                  <div style={detailsBlockStyle}>
                    {selectedNeed.missions.map((m) => (
                      <div key={m.code} style={codeItemStyle}>
                        <span style={codeTagStyle}>{m.code}</span>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}

            {selectedNeed.rso.length > 0 && (
              <div style={detailsRowStyle}>
                <dt style={detailsTermStyle}>Obiettivi politica di coesione UE</dt>
                <dd style={detailsValueStyle}>
                  <div style={detailsBlockStyle}>
                    {selectedNeed.rso.map((r) => (
                      <div key={r.code} style={codeItemStyle}>
                        <span style={codeTagStyle}>{r.code}</span>
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}

            {selectedNeed.funds.length > 0 && (
              <div style={detailsRowStyle}>
                <dt style={detailsTermStyle}>Fondi di riferimento</dt>
                <dd style={detailsValueStyle}>
                  <div style={detailsBlockStyle}>
                    {selectedNeed.funds.map((f) => (
                      <div key={f.code} style={codeItemStyle}>
                        <span style={codeTagStyle}>{f.code}</span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}

            {selectedNeed.funding_gap && (
              <div style={detailsRowStyle}>
                <dt style={detailsTermStyle}>Funding gap</dt>
                <dd style={{ ...detailsValueStyle, ...fundingGapStyle }}>
                  Fabbisogno con gap di finanziamento strutturale
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p style={detailsEmptyStyle}>
            Seleziona un fabbisogno per visualizzare descrizione, missioni, obiettivi UE e fondi europei di riferimento.
          </p>
        )}
      </section>

      <style>{`
        .step1-4-interactive {
          border: 1px solid var(--color-border-secondary-light);
        }
        .step1-4-interactive:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--color-border-focus);
        }
      `}</style>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const sectionHintStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
}

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  maxHeight: '320px',
  overflowY: 'auto',
  padding: 'var(--spacing-inset-xs)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const listOptionStyle: CSSProperties = {
  display: 'grid',
  gap: '2px',
  textAlign: 'left',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-squish-s)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
}

const selectedListOptionStyle: CSSProperties = {
  background: 'var(--color-background-primary-lighter)',
  border: '1px solid var(--color-border-primary-light)',
  boxShadow:
    'inset 4px 0 0 var(--color-border-primary-light), 0 0 0 1px rgba(110, 26, 255, 0.35)',
}


const listOptionLabelStyle: CSSProperties = {
  fontWeight: 700,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const listOptionSubLabelStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const disabledBlockStyle: CSSProperties = {
  pointerEvents: 'none',
  opacity: 0.65,
}

const emptyStateStyle: CSSProperties = {
  margin: 0,
  padding: 'var(--spacing-inset-s)',
  color: 'var(--color-text-primary-light)',
}

const detailsBoxStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-secondary-lightest)',
  padding: 'var(--spacing-inset-m)',
}

const detailsTitleStyle: CSSProperties = {
  margin: '0 0 var(--spacing-stack-s)',
  color: 'var(--color-text-primary)',
}

const detailsListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  margin: 0,
}

const detailsRowStyle: CSSProperties = {
  display: 'grid',
  gap: '2px',
}

const detailsTermStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const detailsValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
}

const detailsBlockStyle: CSSProperties = {
  display: 'grid',
  gap: '6px',
}

const codeItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  flexWrap: 'wrap',
}

const codeTagStyle: CSSProperties = {
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-secondary-lighter)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-rounded)',
  padding: '1px 7px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

const detailsEmptyStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
}

const fundingGapStyle: CSSProperties = {
  color: 'var(--color-text-warning)',
  fontWeight: 600,
}
