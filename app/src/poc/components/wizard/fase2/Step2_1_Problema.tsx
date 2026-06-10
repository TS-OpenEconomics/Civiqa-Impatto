import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { RadioGroup } from '../../ui/RadioGroup'
import { Textarea } from '../../ui/Textarea'
import { ProgressiveBlocks } from '../../ui/ProgressiveBlocks'
import type { ProgressiveBlockDef } from '../../ui/ProgressiveBlocks'

const PROBLEMA_DOCUMENTATO_OPTIONS = [
  { value: 'si', label: 'Sì', hint: 'Documentato in atti ufficiali' },
  { value: 'parzialmente', label: 'Parzialmente', hint: 'Evidenza parziale' },
  { value: 'no', label: 'No', hint: 'Non ancora documentato' },
]

const URGENZA_OPTIONS = [
  { value: 'Emergenziale (entro 12 mesi)', label: 'Emergenziale (entro 12 mesi)' },
  { value: 'Breve termine (1-3 anni)', label: 'Breve termine (1-3 anni)' },
  { value: 'Medio termine (3-5 anni)', label: 'Medio termine (3-5 anni)' },
  { value: 'Strutturale/programmato', label: 'Strutturale/programmato' },
]

const EMERGENZA_VALUE = 'Emergenziale (entro 12 mesi)'

export function Step2_1_Problema() {
  const { state, setProblema, setUrgenza } = useWizard()

  const fabDescrizione = useMemo(() => {
    if (!state.fabId) return ''
    return NEEDS_DOCFAP.find((n) => n.code === state.fabId)?.description ?? ''
  }, [state.fabId])

  const showRiferimentoAtto =
    state.problema.documentato === 'si' || state.problema.documentato === 'parzialmente'
  const showAlert = state.urgenza === EMERGENZA_VALUE

  const documentatoLabel =
    PROBLEMA_DOCUMENTATO_OPTIONS.find((o) => o.value === state.problema.documentato)?.label ?? ''

  const blocks: ProgressiveBlockDef[] = [
    {
      id: 'descrizione',
      title: 'Descrizione del fabbisogno',
      complete: state.problema.descrizione.trim().length > 0,
      summary: state.problema.descrizione,
      children: (
        <Textarea
          label="Descrizione del fabbisogno"
          value={state.problema.descrizione}
          onChange={(value) => setProblema({ descrizione: value })}
          required
          maxLength={600}
          rows={4}
          placeholder={fabDescrizione ? `Es. criticità legate a ${fabDescrizione}` : 'Descrivi il fabbisogno'}
          helperText={
            fabDescrizione
              ? `Contesto fabbisogno selezionato: ${fabDescrizione}`
              : 'Inserisci una descrizione chiara del fabbisogno.'
          }
        />
      ),
    },
    {
      id: 'documentato',
      title: 'Fabbisogno documentato',
      complete: state.problema.documentato.trim().length > 0,
      summary: documentatoLabel
        ? showRiferimentoAtto && state.problema.riferimentoAtto
          ? `${documentatoLabel} · ${state.problema.riferimentoAtto}`
          : documentatoLabel
        : undefined,
      children: (
        <div style={blockBodyStyle}>
          <RadioGroup
            legend="Fabbisogno documentato in atti ufficiali?"
            options={PROBLEMA_DOCUMENTATO_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
              description: opt.hint,
            }))}
            value={state.problema.documentato}
            onChange={(value) =>
              setProblema({
                documentato: value,
                riferimentoAtto:
                  value === 'si' || value === 'parzialmente' ? state.problema.riferimentoAtto : '',
              })
            }
            required
          />

          {showRiferimentoAtto && (
            <div style={riferimentoWrapStyle}>
              <InputField
                label="Riferimento delibera/atto"
                value={state.problema.riferimentoAtto ?? ''}
                onChange={(value) => setProblema({ riferimentoAtto: value })}
                placeholder="Delibera, determina o altro riferimento (opzionale)"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'urgenza',
      title: "Urgenza dell'intervento",
      complete: state.urgenza.trim().length > 0,
      summary: state.urgenza || undefined,
      children: (
        <div style={blockBodyStyle}>
          <RadioGroup
            legend="Urgenza dell'intervento"
            options={URGENZA_OPTIONS}
            value={state.urgenza}
            onChange={(value) => setUrgenza(value)}
            required
          />

          {showAlert && (
            <div role="alert" aria-live="assertive" style={alertStyle}>
              Verificare compatibilità con procedure ordinarie D.Lgs. 36/2023 art. 140 e seguenti
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div style={rootStyle}>
      <ProgressiveBlocks blocks={blocks} />
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  width: '100%',
}

const blockBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const riferimentoWrapStyle: CSSProperties = {
  display: 'grid',
}

const alertStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-warning)',
  background: 'var(--color-background-warning-lightest, var(--color-background-inverse))',
  color: 'var(--color-text-warning)',
  fontWeight: 700,
}
