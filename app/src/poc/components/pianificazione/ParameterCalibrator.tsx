import { usePlanning } from '../../PlanningContext'
import { stimaCosto } from '../../data/mockMOP'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ds'

/* ─── Calibrazione parametri — ogni alternativa singolarmente ─── */

const formatEuro = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const formatDurata = (mesi: number) =>
  mesi >= 12 ? `${Math.floor(mesi / 12)} ann${Math.floor(mesi / 12) === 1 ? 'o' : 'i'}${mesi % 12 ? ` ${mesi % 12}m` : ''}` : `${mesi} mesi`

export function ParameterCalibrator() {
  const { state, setState, goToStep } = usePlanning()
  const navigate = useNavigate()
  const { interventiSelezionati, capexMax } = state

  if (interventiSelezionati.length === 0) {
    goToStep('interventi')
    return null
  }

  const updateParametro = (interventoIdx: number, nomeParametro: string, valore: number) => {
    const updated = [...interventiSelezionati]
    const sel = { ...updated[interventoIdx] }
    sel.parametriCustom = { ...sel.parametriCustom, [nomeParametro]: valore }
    sel.costoStimato = stimaCosto(sel.intervento, sel.parametriCustom)
    updated[interventoIdx] = sel
    setState({ interventiSelezionati: updated })
  }

  const hasWarning = interventiSelezionati.some(s => capexMax > 0 && s.costoStimato > capexMax)

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Back */}
      <button
        onClick={() => goToStep('interventi')}
        className="text-sm text-bluette-700 hover:underline mb-6 block"
      >
        ← Torna alle alternative
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          Calibrazione
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Dimensiona le alternative
        </h1>
        <p className="text-gray-500">
          Configura i parametri di ciascuna alternativa. Il costo si aggiorna automaticamente. 
          {capexMax > 0 && ` Budget massimo dichiarato: ${formatEuro(capexMax)}.`}
        </p>
      </div>

      {/* Interventi con slider — uno per uno */}
      <div className="space-y-6">
        {interventiSelezionati.map((sel, idx) => {
          const overBudget = capexMax > 0 && sel.costoStimato > capexMax

          return (
            <div
              key={sel.intervento.id}
              className={`bg-white border rounded-xl overflow-hidden ${
                overBudget ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              {/* Intervento header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Alternativa {idx + 1} di {interventiSelezionati.length}
                  </p>
                  <h3 className="font-bold text-gray-900">{sel.intervento.categoriaIntervento}</h3>
                  <p className="text-xs text-gray-500">{sel.intervento.tipoLabel}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${overBudget ? 'text-red-600' : 'text-bluette-700'}`}>
                    {formatEuro(sel.costoStimato)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Durata: ~{formatDurata(sel.intervento.durataMedio)}
                  </p>
                </div>
              </div>

              {/* Warning budget */}
              {overBudget && (
                <div className="bg-red-50 px-6 py-3 flex items-center gap-2 border-b border-red-200">
                  <span className="text-red-500 text-sm">⚠</span>
                  <p className="text-sm text-red-700 font-medium">
                    Questa alternativa supera il budget di {formatEuro(sel.costoStimato - capexMax)}. 
                    Riduci i parametri o <button onClick={() => goToStep('vincoli')} className="underline font-bold">modifica il budget</button>.
                  </p>
                </div>
              )}

              {/* Parametri slider */}
              <div className="px-6 py-5 space-y-5">
                {sel.intervento.parametri.map((param) => {
                  const currentValue = sel.parametriCustom[param.nome] ?? param.default

                  return (
                    <div key={param.nome}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">
                          {param.nome}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {currentValue.toLocaleString('it-IT')}
                          </span>
                          <span className="text-sm text-gray-400">{param.udm}</span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={Math.max(1, Math.round((param.max - param.min) / 50))}
                        value={currentValue}
                        onChange={(e) => updateParametro(idx, param.nome, Number(e.target.value))}
                        className="w-full accent-bluette-700"
                      />

                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{param.min.toLocaleString('it-IT')} {param.udm}</span>
                        <span className="text-gray-500">
                          ~{formatEuro(currentValue * param.costoUnitario)}
                        </span>
                        <span>{param.max.toLocaleString('it-IT')} {param.udm}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Warning globale se almeno una supera il budget */}
      {hasWarning && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg">⚡</span>
          <p className="text-sm text-amber-800">
            Una o più alternative superano il budget dichiarato. Puoi comunque procedere al confronto — 
            il DOCFAP le analizzerà tutte e ti aiuterà a scegliere la migliore.
          </p>
        </div>
      )}

      {/* Bottom action */}
      <div className="mt-8 bg-white border-2 border-bluette-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">
              {interventiSelezionati.length} alternativ{interventiSelezionati.length === 1 ? 'a' : 'e'} configurata{interventiSelezionati.length === 1 ? '' : 'e'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Il DOCFAP le confronterà con l'opzione zero per identificare la scelta migliore.
            </p>
          </div>
          <Button
            onClick={() => {
              const isPilota = state.fabbisognoSelezionato?.id === 'fab-ist-02'
              if (isPilota) {
                navigate('/impatti/docfap?from=planning&fab=ist-02')
              } else {
                navigate('/impatti/docfap')
              }
            }}
            className="shrink-0"
          >
            Vai al confronto →
          </Button>
        </div>
      </div>
    </div>
  )
}