import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ENTE } from '../../../data/mockDataRoom'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { Step4_1_Localizzazione } from '../fase4/Step4_1_Localizzazione'

export function Step1_1_Ente() {
  const { state, setRup } = useWizard()
  const [touched, setTouched] = useState({ nome: false, data: false, email: false })

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const rupNomeError =
    touched.nome && state.rup.nome.trim().length === 0 ? 'Inserisci il nominativo RUP.' : undefined
  const dataCompilazioneError =
    touched.data && today.trim().length === 0 ? 'La data di compilazione è obbligatoria.' : undefined
  const emailError =
    touched.email && state.rup.email.trim().length > 0 && !/\S+@\S+\.\S+/.test(state.rup.email)
      ? 'Inserisci un indirizzo email valido.'
      : undefined

  return (
    <div style={rootStyle}>
      <div style={readonlyGridStyle}>
        <InputField label="Nome ente" value={ENTE.nome} onChange={() => undefined} readOnly />
        <InputField
          label="Tipo stazione appaltante"
          value="Comune"
          onChange={() => undefined}
          readOnly
        />
      </div>

      <Step4_1_Localizzazione />

      <div style={formGridStyle}>
        <InputField
          label="Nominativo RUP"
          value={state.rup.nome}
          onChange={(value) => {
            setTouched((prev) => ({ ...prev, nome: true }))
            setRup({ nome: value })
          }}
          required
          errorText={rupNomeError}
        />
        <InputField
          label="Data compilazione"
          type="date"
          value={today}
          onChange={() => undefined}
          required
          errorText={dataCompilazioneError}
        />
        <InputField
          label="Email RUP"
          type="email"
          value={state.rup.email}
          onChange={(value) => {
            setTouched((prev) => ({ ...prev, email: true }))
            setRup({ email: value })
          }}
          errorText={emailError}
        />
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const readonlyGridStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-inline-s)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
}

const formGridStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-inline-s)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
}
