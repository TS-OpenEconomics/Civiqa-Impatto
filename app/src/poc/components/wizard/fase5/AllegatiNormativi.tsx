import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'

interface AllegatoItem {
  id: string
  label: string
  normRef: string
  note?: string
}

interface UploadedFile {
  name: string
  sizeKb: number
}

const ALLEGATI: AllegatoItem[] = [
  {
    id: 'inquadramento-urbanistico',
    label: 'Inquadramento urbanistico e territoriale',
    normRef: 'Art. 2, c.4, b)',
    note: 'Documento da allegare a cura del RUP',
  },
  {
    id: 'incidenze-paesaggistiche',
    label: 'Verifica incidenze paesaggistiche e archeologiche',
    normRef: 'Art. 2, c.2',
    note: 'Documento da allegare a cura del RUP',
  },
  {
    id: 'schemi-grafici',
    label: 'Schemi grafici delle alternative progettuali',
    normRef: 'Art. 2, c.4, d)',
    note: 'Documento da allegare a cura del RUP',
  },
  {
    id: 'piano-finanziario',
    label: 'Piano finanziario e fonti di copertura',
    normRef: 'Art. 2, c.4, f)',
  },
]

function formatSize(sizeKb: number): string {
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`
  return `${sizeKb} KB`
}

export function AllegatiNormativi() {
  const [uploaded, setUploaded] = useState<Record<string, UploadedFile>>({})
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function handleFileChange(id: string, files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    setUploaded((prev) => ({
      ...prev,
      [id]: {
        name: file.name,
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
      },
    }))
    // Reset input so the same file can be re-selected after removal
    if (inputRefs.current[id]) inputRefs.current[id]!.value = ''
  }

  function handleRemove(id: string) {
    setUploaded((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <div style={rootStyle}>
      <p style={infoStyle}>
        Il DOCFAP richiede i seguenti allegati ai sensi del D.Lgs. 36/2023 All. I.7.
      </p>
      <ul style={listStyle} role="list">
        {ALLEGATI.map((a) => {
          const file = uploaded[a.id]
          return (
            <li key={a.id} style={itemStyle}>
              <div style={itemInfoStyle}>
                <span style={labelStyle}>{a.label}</span>
                <span style={normRefTagStyle}>{a.normRef}</span>
                {a.note && <span style={noteStyle}>{a.note}</span>}
                {file && (
                  <span style={fileNameStyle} title={file.name}>
                    {file.name}
                    <span style={fileSizeStyle}>{formatSize(file.sizeKb)}</span>
                  </span>
                )}
              </div>

              <div style={actionGroupStyle}>
                {file ? (
                  <>
                    <button
                      type="button"
                      onClick={() => inputRefs.current[a.id]?.click()}
                      aria-label={`Sostituisci ${a.label}`}
                      style={replaceBtnStyle}
                      className="allegati-btn"
                    >
                      Sostituisci
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(a.id)}
                      aria-label={`Rimuovi ${a.label}`}
                      style={removeBtnStyle}
                      className="allegati-btn-danger"
                    >
                      Rimuovi
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRefs.current[a.id]?.click()}
                    aria-label={`Carica ${a.label}`}
                    style={uploadBtnStyle}
                    className="allegati-btn-primary"
                  >
                    Carica
                  </button>
                )}
                <input
                  ref={(el) => { inputRefs.current[a.id] = el }}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  style={hiddenInputStyle}
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={(e) => handleFileChange(a.id, e.target.files)}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <style>{`
        .allegati-btn {
          flex-shrink: 0;
          padding: var(--spacing-inset-xs) var(--spacing-inset-s);
          border: 1px solid var(--color-border-secondary-light);
          border-radius: var(--radius-smooth);
          background: var(--color-background-inverse);
          color: var(--color-text-primary);
          font-size: var(--type-body-s-size, 14px);
          cursor: pointer;
        }
        .allegati-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--color-border-focus);
        }
        .allegati-btn:hover { background: var(--color-background-secondary-lightest); }
        .allegati-btn-primary {
          flex-shrink: 0;
          padding: var(--spacing-inset-xs) var(--spacing-inset-s);
          border: 1px solid var(--color-border-primary-light);
          border-radius: var(--radius-smooth);
          background: var(--color-background-primary-lighter);
          color: var(--color-text-primary);
          font-size: var(--type-body-s-size, 14px);
          cursor: pointer;
        }
        .allegati-btn-primary:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--color-border-focus);
        }
        .allegati-btn-primary:hover { background: var(--color-background-primary-light); }
        .allegati-btn-danger {
          flex-shrink: 0;
          padding: var(--spacing-inset-xs) var(--spacing-inset-s);
          border: 1px solid var(--color-border-danger, #e53935);
          border-radius: var(--radius-smooth);
          background: transparent;
          color: var(--color-text-danger, #c0392b);
          font-size: var(--type-body-s-size, 14px);
          cursor: pointer;
        }
        .allegati-btn-danger:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--color-border-focus);
        }
        .allegati-btn-danger:hover { background: var(--color-background-danger-lighter, #fff0f0); }
      `}</style>
    </div>
  )
}

const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-m)' }
const infoStyle: CSSProperties = { margin: 0, color: 'var(--color-text-primary)' }
const listStyle: CSSProperties = { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--spacing-stack-xs)' }
const itemStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-inline-m)', padding: 'var(--spacing-inset-s)', border: '1px solid var(--color-border-secondary-light)', borderRadius: 'var(--radius-smooth)' }
const itemInfoStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }
const labelStyle: CSSProperties = { color: 'var(--color-text-primary)', fontSize: 'var(--type-body-s-size, 14px)', fontWeight: 500 }
const normRefTagStyle: CSSProperties = { display: 'inline-block', fontFamily: 'var(--font-family-0)', fontSize: '11px', color: 'var(--color-text-primary-light)', background: 'var(--color-background-secondary-lighter)', border: '1px solid var(--color-border-secondary-light)', borderRadius: 'var(--radius-rounded)', padding: '1px 7px', width: 'fit-content' }
const noteStyle: CSSProperties = { fontSize: '11px', color: 'var(--color-text-primary-lighter)', fontStyle: 'italic' }
const fileNameStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-success, #2e7d32)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }
const fileSizeStyle: CSSProperties = { color: 'var(--color-text-primary-light)', fontWeight: 400, flexShrink: 0 }
const actionGroupStyle: CSSProperties = { display: 'flex', gap: 'var(--spacing-inline-xs)', flexShrink: 0, alignItems: 'center' }
const uploadBtnStyle: CSSProperties = { flexShrink: 0 }
const replaceBtnStyle: CSSProperties = { flexShrink: 0 }
const removeBtnStyle: CSSProperties = { flexShrink: 0 }
const hiddenInputStyle: CSSProperties = { display: 'none' }
