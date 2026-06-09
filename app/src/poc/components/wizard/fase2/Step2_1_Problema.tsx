import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { RadioGroup } from '../../ui/RadioGroup'
import { Textarea } from '../../ui/Textarea'

const PROBLEMA_DOCUMENTATO_OPTIONS = [
  { value: 'si', label: 'Si' },
  { value: 'parzialmente', label: 'Parzialmente' },
  { value: 'no', label: 'No' },
]

const URGENZA_OPTIONS = [
  { value: 'Emergenziale (entro 12 mesi)', label: 'Emergenziale (entro 12 mesi)' },
  { value: 'Breve termine (1-3 anni)', label: 'Breve termine (1-3 anni)' },
  { value: 'Medio termine (3-5 anni)', label: 'Medio termine (3-5 anni)' },
  { value: 'Strutturale/programmato', label: 'Strutturale/programmato' },
]

const EMERGENZA_VALUE = 'Emergenziale (entro 12 mesi)'

type SectionKey = 'descrizione' | 'documentazione' | 'urgenza'

function LockSection({
  title,
  summary,
  completed,
  open,
  onOpen,
  children,
}: {
  title: string
  summary: string
  completed: boolean
  open: boolean
  onOpen: () => void
  children: ReactNode
}) {
  return (
    <section style={sectionCardStyle}>
      <button type="button" onClick={onOpen} style={sectionHeaderButtonStyle}>
        <span style={sectionHeaderTextStyle}>
          <span style={sectionTitleStyle}>{title}</span>
          <span style={sectionSummaryStyle}>{completed ? summary : 'Da completare'}</span>
        </span>
        <span style={completed ? lockBadgeDoneStyle : lockBadgeStyle}>
          {completed ? 'Bloccato' : 'Aperto'}
        </span>
      </button>
      {open || !completed ? <div style={sectionBodyStyle}>{children}</div> : null}
    </section>
  )
}

export function Step2_1_Problema() {
  const { state, setProblema, setUrgenza } = useWizard()
  const [touchedDescrizione, setTouchedDescrizione] = useState(false)
  const [touchedUrgenza, setTouchedUrgenza] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionKey>('descrizione')

  const fabDescrizione = useMemo(() => {
    if (!state.fabId) return ''
    return NEEDS_DOCFAP.find((n) => n.code === state.fabId)?.description ?? ''
  }, [state.fabId])

  const descrizioneError =
    touchedDescrizione && state.problema.descrizione.trim().length === 0
      ? 'La descrizione del fabbisogno e obbligatoria.'
      : undefined

  const urgenzaError =
    touchedUrgenza && state.urgenza.trim().length === 0
      ? "Seleziona il livello di urgenza."
      : undefined

  const showRiferimentoAtto =
    state.problema.documentato === 'si' || state.problema.documentato === 'parzialmente'
  const showAlert = state.urgenza === EMERGENZA_VALUE
  const descrizioneCompleted = state.problema.descrizione.trim().length > 0
  const documentazioneCompleted = state.problema.documentato.trim().length > 0
  const urgenzaCompleted = state.urgenza.trim().length > 0

  return (
    <div style={rootStyle}>
      <div style={detailGridStyle}>
        <LockSection
          title="Descrizione del fabbisogno"
          summary={state.problema.descrizione.trim().slice(0, 160)}
          completed={descrizioneCompleted}
          open={activeSection === 'descrizione'}
          onOpen={() => setActiveSection('descrizione')}
        >
          <Textarea
            label="Descrizione del fabbisogno"
            value={state.problema.descrizione}
            onChange={(value) => {
              setTouchedDescrizione(true)
              setProblema({ descrizione: value })
            }}
            required
            maxLength={600}
            rows={4}
            placeholder={fabDescrizione ? `Es. criticita legate a ${fabDescrizione}` : 'Descrivi il fabbisogno'}
            helperText={
              fabDescrizione
                ? `Contesto fabbisogno selezionato: ${fabDescrizione}`
                : 'Inserisci una descrizione chiara del fabbisogno.'
            }
            errorText={descrizioneError}
          />
          <button
            type="button"
            disabled={!descrizioneCompleted}
            onClick={() => setActiveSection('documentazione')}
            style={descrizioneCompleted ? lockButtonStyle : lockButtonDisabledStyle}
          >
            Conferma descrizione
          </button>
        </LockSection>

        <LockSection
          title="Documentazione ufficiale"
          summary={
            state.problema.documentato === 'si'
              ? 'Documentato in atti ufficiali'
              : state.problema.documentato === 'parzialmente'
                ? 'Documentato parzialmente'
                : state.problema.documentato === 'no'
                  ? 'Non documentato'
                  : ''
          }
          completed={documentazioneCompleted}
          open={activeSection === 'documentazione'}
          onOpen={() => setActiveSection('documentazione')}
        >
          <RadioGroup
            legend="Fabbisogno documentato in atti ufficiali?"
            options={PROBLEMA_DOCUMENTATO_OPTIONS}
            value={state.problema.documentato}
            onChange={(value) => {
              setProblema({
                documentato: value,
                riferimentoAtto:
                  value === 'si' || value === 'parzialmente' ? state.problema.riferimentoAtto : '',
              })
            }}
          />

          {showRiferimentoAtto && (
            <InputField
              label="Riferimento delibera/atto"
              value={state.problema.riferimentoAtto ?? ''}
              onChange={(value) => setProblema({ riferimentoAtto: value })}
              placeholder="Delibera, determina o altro riferimento (opzionale)"
            />
          )}
          <button
            type="button"
            disabled={!documentazioneCompleted}
            onClick={() => setActiveSection('urgenza')}
            style={documentazioneCompleted ? lockButtonStyle : lockButtonDisabledStyle}
          >
            Conferma documentazione
          </button>
        </LockSection>

        <LockSection
          title="Urgenza dell'intervento"
          summary={state.urgenza}
          completed={urgenzaCompleted}
          open={activeSection === 'urgenza'}
          onOpen={() => setActiveSection('urgenza')}
        >
          <RadioGroup
            legend="Urgenza dell'intervento"
            options={URGENZA_OPTIONS}
            value={state.urgenza}
            onChange={(value) => {
              setTouchedUrgenza(true)
              setUrgenza(value)
            }}
            required
            errorText={urgenzaError}
          />

          {showAlert && (
            <div role="alert" aria-live="assertive" style={alertStyle}>
              Verificare compatibilita con procedure ordinarie D.Lgs. 36/2023 art. 140 e seguenti
            </div>
          )}
        </LockSection>
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const detailGridStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  maxWidth: '920px',
}

const sectionCardStyle: CSSProperties = {
  display: 'grid',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  overflow: 'hidden',
}

const sectionHeaderButtonStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'var(--color-background-inverse)',
  padding: 'var(--spacing-inset-s)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--spacing-inline-s)',
  textAlign: 'left',
  cursor: 'pointer',
}

const sectionHeaderTextStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
  minWidth: 0,
}

const sectionTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontWeight: 700,
}

const sectionSummaryStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  lineHeight: 1.35,
}

const sectionBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  borderTop: '1px solid var(--color-border-secondary-light)',
  padding: 'var(--spacing-inset-s)',
}

const lockBadgeStyle: CSSProperties = {
  flexShrink: 0,
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-rounded)',
  padding: '3px 10px',
  color: 'var(--color-text-primary-light)',
  fontSize: '12px',
  fontWeight: 700,
}

const lockBadgeDoneStyle: CSSProperties = {
  ...lockBadgeStyle,
  borderColor: 'var(--color-border-primary-light)',
  background: 'var(--color-background-primary-lighter)',
  color: 'var(--color-text-secondary)',
}

const lockButtonStyle: CSSProperties = {
  justifySelf: 'start',
  minHeight: '36px',
  border: '1px solid var(--color-background-primary)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  padding: '0 var(--spacing-inset-s)',
  cursor: 'pointer',
  fontWeight: 700,
}

const lockButtonDisabledStyle: CSSProperties = {
  ...lockButtonStyle,
  borderColor: 'var(--color-background-disable)',
  background: 'var(--color-background-disable)',
  color: 'var(--color-text-disable)',
  cursor: 'not-allowed',
}

const alertStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-warning)',
  background: 'var(--color-background-warning-lightest, var(--color-background-inverse))',
  color: 'var(--color-text-warning)',
  fontWeight: 700,
}
