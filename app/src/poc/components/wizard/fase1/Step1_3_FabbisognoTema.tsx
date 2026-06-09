import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'

// ── Search helpers ────────────────────────────────────────────────────────────

function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter((w) => w.length >= 3)
}

// Strip the final vowel to approximate an Italian stem.
// asilo→asil, asili→asil, nido→nid, nidi→nid, edificio→edific
function italianStem(word: string): string {
  if (word.length <= 3) return word
  return word.replace(/[aeiouàèéìíòóùú]$/, '')
}

function scoreNeed(label: string, description: string, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const l = label.toLowerCase()
  const d = description.toLowerCase()
  let score = 0
  for (const token of tokens) {
    const stem = italianStem(token)
    if (l.includes(token)) score += 6
    else if (l.includes(stem)) score += 4
    else if (d.includes(token)) score += 2
    else if (d.includes(stem)) score += 1
  }
  return score
}

// ── Tema catalogue (derived from NEEDS, TC01–TC12) ────────────────────────────

interface Theme {
  id: string
  label: string
}

const TEMI: Theme[] = [
  { id: 'TC01', label: 'Cultura e turismo' },
  { id: 'TC02', label: 'Economia e lavoro' },
  { id: 'TC03', label: 'Istruzione e formazione' },
  { id: 'TC04', label: 'Welfare e inclusione' },
  { id: 'TC05', label: 'Salute e sanità' },
  { id: 'TC06', label: 'Ambiente e territorio' },
  { id: 'TC07', label: 'Mobilità e trasporti' },
  { id: 'TC08', label: 'Patrimonio pubblico' },
  { id: 'TC09', label: 'Energia e clima' },
  { id: 'TC10', label: 'Sport e tempo libero' },
  { id: 'TC11', label: 'Ricerca e innovazione' },
  { id: 'TC12', label: 'PA e innovazione' },
]

// ── Theme icons ───────────────────────────────────────────────────────────────

function ThemeBadgeIcon({ themeId }: { themeId: string }) {
  const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    width: 20,
    height: 20,
  }

  switch (themeId) {
    case 'TC01': // Cultura e turismo
      return (
        <svg {...iconProps}>
          <path d="M4 20h16" />
          <path d="M6 20V9" />
          <path d="M10 20V9" />
          <path d="M14 20V9" />
          <path d="M18 20V9" />
          <path d="M3 9h18L12 4 3 9Z" />
        </svg>
      )
    case 'TC02': // Economia e lavoro
      return (
        <svg {...iconProps}>
          <rect x="4" y="7" width="16" height="11" rx="2" />
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
          <path d="M4 11h16" />
        </svg>
      )
    case 'TC03': // Istruzione e formazione
      return (
        <svg {...iconProps}>
          <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
          <path d="M7 10.5v4c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-4" />
        </svg>
      )
    case 'TC04': // Welfare e inclusione
      return (
        <svg {...iconProps}>
          <path d="M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          <path d="M16.5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M4.5 18a3.5 3.5 0 0 1 7 0" />
          <path d="M13 18a3 3 0 0 1 6 0" />
        </svg>
      )
    case 'TC05': // Salute e sanità
      return (
        <svg {...iconProps}>
          <path d="M12 20s-6-3.8-6-9a3.5 3.5 0 0 1 6-2.2A3.5 3.5 0 0 1 18 11c0 5.2-6 9-6 9Z" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      )
    case 'TC06': // Ambiente e territorio
      return (
        <svg {...iconProps}>
          <path d="M18 6c-4 .2-7 2.5-8.6 5.8C8.1 14.4 8.2 17 9 20c2.6-.8 5.1-.7 7.3-2 3.3-1.9 5.5-5 5.7-9.5-1.2-1.7-2.2-2.4-4-2.5Z" />
          <path d="M8 20c1.5-3.3 4-5.8 7.5-7.5" />
        </svg>
      )
    case 'TC07': // Mobilità e trasporti
      return (
        <svg {...iconProps}>
          <path d="M4 16h16" />
          <path d="M7 16 10 8h4l3 8" />
          <path d="M9 20h.01" />
          <path d="M15 20h.01" />
        </svg>
      )
    case 'TC08': // Patrimonio pubblico
      return (
        <svg {...iconProps}>
          <path d="M4 20h16" />
          <path d="M6 20v-8" />
          <path d="M10 20v-8" />
          <path d="M14 20v-8" />
          <path d="M18 20v-8" />
          <path d="M3 12h18L12 5 3 12Z" />
        </svg>
      )
    case 'TC09': // Energia e clima
      return (
        <svg {...iconProps}>
          <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />
        </svg>
      )
    case 'TC10': // Sport e tempo libero
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 5v14" />
          <path d="M5.5 9.5h13" />
          <path d="M5.5 14.5h13" />
        </svg>
      )
    case 'TC11': // Ricerca e innovazione
      return (
        <svg {...iconProps}>
          <path d="M9 14a4 4 0 1 1 6 0c-.7.5-1 1.1-1.2 2H10.2c-.2-.9-.5-1.5-1.2-2Z" />
          <path d="M10 19h4" />
          <path d="M10.5 22h3" />
        </svg>
      )
    case 'TC12': // PA e innovazione
      return (
        <svg {...iconProps}>
          <rect x="4" y="5" width="16" height="11" rx="2" />
          <path d="M10 19h4" />
          <path d="M8 16h8" />
        </svg>
      )
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      )
  }
}

export function Step1_3_FabbisognoTema() {
  const { state, setFab, setCluster } = useWizard()

  const initialThemeId = state.temaId ?? null
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(initialThemeId)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [mode, setMode] = useState<'guided' | 'search'>('guided')

  const selectedTheme = useMemo(
    () => TEMI.find((t) => t.id === selectedThemeId) ?? null,
    [selectedThemeId],
  )

  const selectedNeed = useMemo(
    () => NEEDS_DOCFAP.find((n) => n.code === state.fabId) ?? null,
    [state.fabId],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setSelectedThemeId(initialThemeId)
  }, [initialThemeId])

  const filteredNeeds = useMemo(() => {
    const query = debouncedSearch.trim()
    if (query.length < 2) return []
    const tokens = tokenize(query)
    if (tokens.length === 0) return []
    return NEEDS_DOCFAP
      .map((n) => ({ need: n, score: scoreNeed(n.label, n.description, tokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ need }) => need)
  }, [debouncedSearch])

  const onSelectTheme = (themeId: string) => {
    if (themeId === selectedThemeId) return
    setSelectedThemeId(themeId)
    setSearchTerm('')
    setDebouncedSearch('')
    setFab(null, themeId)
    setCluster(null)
  }

  const onSelectFabbisogno = (fabCode: string) => {
    const need = NEEDS_DOCFAP.find((n) => n.code === fabCode)
    if (!need) return
    setSelectedThemeId(need.tema_code)
    setFab(need.code, need.tema_code)
    setCluster(need.cluster_mca === 'NONE' ? null : need.cluster_mca)
  }

  const needsByTheme = useMemo(() => {
    if (!selectedThemeId) return []
    return NEEDS_DOCFAP.filter((n) => n.tema_code === selectedThemeId)
  }, [selectedThemeId])

  return (
    <div style={rootStyle}>
      <section style={modeGridStyle}>
        <section style={mode === 'guided' ? { ...modeCardStyle, ...modeCardActiveStyle } : modeCardStyle}>
          <button type="button" style={modeHeaderButtonStyle} onClick={() => setMode('guided')}>
            <span style={modeTitleStyle}>Percorso guidato</span>
            <span style={modeMetaStyle}>
              {selectedTheme ? selectedNeed ? `${selectedTheme.label} · ${selectedNeed.label}` : selectedTheme.label : 'Tema + fabbisogno'}
            </span>
          </button>

          {mode === 'guided' ? (
            <div style={modeBodyStyle}>
              <fieldset style={themeListStyle}>
                <legend style={srOnlyStyle}>Tema del fabbisogno</legend>
                {TEMI.map((theme) => {
                  const isSelected = selectedThemeId === theme.id
                  return (
                    <label
                      key={theme.id}
                      className={`step1-3-interactive${isSelected ? ' step1-3-selected' : ''}`}
                      style={themeRowStyle}
                    >
                      <input
                        type="radio"
                        name="tema-fabbisogno"
                        value={theme.id}
                        checked={isSelected}
                        onChange={() => onSelectTheme(theme.id)}
                        style={radioStyle}
                      />
                      <span aria-hidden="true" style={themeCodeStyle}>
                        <ThemeBadgeIcon themeId={theme.id} />
                      </span>
                      <span style={themeTextStyle}>{theme.label}</span>
                    </label>
                  )
                })}
              </fieldset>

              {selectedTheme ? (
                <div style={guidedListWrapStyle}>
                  <div style={guidedHeaderStyle}>
                    <h3 style={guidedTitleStyle}>Fabbisogni di {selectedTheme.label}</h3>
                    <span style={guidedCountStyle}>{needsByTheme.length} opzioni</span>
                  </div>
                  <div
                    role="listbox"
                    aria-label="Fabbisogni del tema selezionato"
                    aria-activedescendant={state.fabId ? `fab-option-${state.fabId}` : undefined}
                    style={needListStyle}
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
                          className={`step1-3-interactive${isSelected ? ' step1-3-selected' : ''}`}
                          onClick={() => onSelectFabbisogno(need.code)}
                          style={isSelected ? { ...needOptionStyle, ...selectedNeedOptionStyle } : needOptionStyle}
                        >
                          <span style={searchResultHeaderStyle}>
                            <span style={searchResultLabelStyle}>{need.label}</span>
                            <span style={searchResultThemeStyle}>{need.code}</span>
                          </span>
                          <span style={searchResultSubLabelStyle}>{need.description}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section style={mode === 'search' ? { ...modeCardStyle, ...modeCardActiveStyle } : modeCardStyle}>
          <button type="button" style={modeHeaderButtonStyle} onClick={() => setMode('search')}>
            <span style={modeTitleStyle}>Cerca fabbisogno</span>
            <span style={modeMetaStyle}>{selectedNeed ? selectedNeed.label : 'Ricerca diretta'}</span>
          </button>

          {mode === 'search' ? (
            <div style={{ ...modeBodyStyle, ...searchBoxStyle }}>
              <InputField
                label="Ricerca assistita fabbisogno"
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Cerca per titolo o descrizione del fabbisogno"
                ariaLabel="Ricerca assistita fabbisogno"
                helperText="Selezionando un risultato vengono impostati automaticamente macro tema e fabbisogno."
              />

              {debouncedSearch.trim().length >= 2 && (
                <div role="listbox" aria-label="Risultati ricerca fabbisogno" style={searchResultsStyle}>
                  {filteredNeeds.length > 0 && (
                    <p style={searchCountStyle} aria-live="polite">
                      {filteredNeeds.length} fabbisogn{filteredNeeds.length === 1 ? 'o' : 'i'} trovat{filteredNeeds.length === 1 ? 'o' : 'i'}
                    </p>
                  )}
                  {filteredNeeds.map((need) => {
                    const themeLabel = TEMI.find((t) => t.id === need.tema_code)?.label ?? need.tema_code
                    return (
                      <button
                        key={need.code}
                        type="button"
                        role="option"
                        className="step1-3-interactive"
                        onClick={() => onSelectFabbisogno(need.code)}
                        style={searchResultOptionStyle}
                      >
                        <span style={searchResultHeaderStyle}>
                          <span style={searchResultLabelStyle}>{need.label}</span>
                          <span style={searchResultThemeStyle}>{themeLabel}</span>
                        </span>
                        <span style={searchResultSubLabelStyle}>{need.description}</span>
                      </button>
                    )
                  })}

                  {filteredNeeds.length === 0 && (
                    <p style={emptySearchStateStyle} aria-live="polite">
                      Nessun fabbisogno trovato per "{debouncedSearch.trim()}". Prova con un termine diverso o usa il percorso guidato.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </section>
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
                    {selectedNeed.missions.map((mission) => (
                      <div key={mission.code} style={codeItemStyle}>
                        <span style={codeTagStyle}>{mission.code}</span>
                        <span>{mission.label}</span>
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
                    {selectedNeed.rso.map((rso) => (
                      <div key={rso.code} style={codeItemStyle}>
                        <span style={codeTagStyle}>{rso.code}</span>
                        <span>{rso.label}</span>
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
                    {selectedNeed.funds.map((fund) => (
                      <div key={fund.code} style={codeItemStyle}>
                        <span style={codeTagStyle}>{fund.code}</span>
                        <span>{fund.label}</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p style={detailsEmptyStyle}>
            Seleziona un fabbisogno dal percorso guidato o dalla ricerca per visualizzare i dettagli.
          </p>
        )}
      </section>

      <style>{`
        .step1-3-interactive:focus-visible,
        .step1-3-interactive:focus-within {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-border-focus);
        }
        .step1-3-selected {
          outline: 2px solid var(--color-border-primary-light);
          outline-offset: -2px;
        }
      `}</style>

      <div style={srOnlyStyle}>
        {selectedTheme ? `Tema selezionato: ${selectedTheme.label}` : 'Nessun tema selezionato'}
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const modeGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 'var(--spacing-inline-s)',
  alignItems: 'start',
}

const modeCardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  overflow: 'hidden',
}

const modeCardActiveStyle: CSSProperties = {
  borderColor: 'var(--color-border-primary-light)',
  boxShadow: 'inset 0 3px 0 var(--color-border-primary-light)',
}

const modeHeaderButtonStyle: CSSProperties = {
  width: '100%',
  minHeight: '74px',
  border: 'none',
  background: 'transparent',
  padding: 'var(--spacing-inset-s)',
  display: 'grid',
  gap: '4px',
  textAlign: 'left',
  cursor: 'pointer',
}

const modeTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 700,
}

const modeMetaStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  lineHeight: 1.35,
}

const modeBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  borderTop: '1px solid var(--color-border-secondary-light)',
  padding: 'var(--spacing-inset-s)',
}

const themeListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '12px',
  border: 'none',
  padding: 0,
  margin: 0,
}

const themeRowStyle: CSSProperties = {
  position: 'relative',
  display: 'grid',
  gap: '4px',
  padding: '16px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  cursor: 'pointer',
}


const themeCodeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  borderRadius: 'var(--radius-rounded)',
  background: 'var(--color-background-primary-lighter)',
  color: 'var(--color-text-secondary)',
}

const themeTextStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-bold, 700)',
}

const searchBoxStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  marginTop: 'var(--spacing-stack-xs)',
}

const guidedListWrapStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const guidedHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
}

const guidedTitleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: 'var(--type-body-s-size, 16px)',
}

const guidedCountStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 13px)',
}

const needListStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  maxHeight: '320px',
  overflowY: 'auto',
  padding: 'var(--spacing-inset-xs)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const needOptionStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
  textAlign: 'left',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-squish-s)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
}

const selectedNeedOptionStyle: CSSProperties = {
  background: 'var(--color-background-primary-lighter)',
  borderColor: 'var(--color-border-primary-light)',
  boxShadow: 'inset 4px 0 0 var(--color-border-primary-light)',
}

const searchResultsStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  maxHeight: '320px',
  overflowY: 'auto',
  padding: 'var(--spacing-inset-xs)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const searchResultOptionStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
  textAlign: 'left',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: 'var(--spacing-inset-squish-s)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
}

const searchResultHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
}

const searchResultLabelStyle: CSSProperties = {
  fontWeight: 700,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const searchResultThemeStyle: CSSProperties = {
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 'var(--type-weight-medium, 500)',
  flexShrink: 0,
}

const searchResultSubLabelStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

const searchCountStyle: CSSProperties = {
  margin: 0,
  padding: '2px var(--spacing-inset-xs)',
  fontSize: 'var(--type-body-xs-size, 12px)',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0)',
}

const emptySearchStateStyle: CSSProperties = {
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

const radioStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}
