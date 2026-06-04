import { usePlanning } from '../../PlanningContext'
import { ENTE } from '../../data/mockDataRoom'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ds'

/* ─── Riepilogo finale e handoff verso DOCFAP ─── */

const formatEuro = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const formatDurata = (mesi: number) =>
  mesi >= 12 ? `${Math.floor(mesi / 12)} ann${Math.floor(mesi / 12) === 1 ? 'o' : 'i'}${mesi % 12 ? ` ${mesi % 12}m` : ''}` : `${mesi} mesi`

export function PlanningHandoff() {
  const { state, goToStep } = usePlanning()
  const navigate = useNavigate()
  const { fabbisognoSelezionato, interventiSelezionati, capexMax, orizzonteTemporaleMesi } = state

  const costoTotale = interventiSelezionati.reduce((acc, s) => acc + s.costoStimato, 0)
  const multipleAlternative = interventiSelezionati.length > 1

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Back */}
      <button
        onClick={() => goToStep('calibrazione')}
        className="text-sm text-bluette-700 hover:underline mb-6 block"
      >
        ← Torna alla calibrazione
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          Riepilogo pianificazione
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Pronto per l'analisi
        </h1>
        <p className="text-gray-500">
          Ecco il riepilogo del tuo piano. I parametri per le analisi CBA e EIA sono stati raccolti automaticamente.
        </p>
      </div>

      {/* Ente + fabbisogno */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Ente</p>
            <p className="font-bold text-gray-900">{ENTE.nome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Fabbisogno</p>
            <p className="font-bold text-gray-900">{fabbisognoSelezionato?.nome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Budget max</p>
            <p className="font-bold text-gray-900">{formatEuro(capexMax)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Orizzonte</p>
            <p className="font-bold text-gray-900">{formatDurata(orizzonteTemporaleMesi)}</p>
          </div>
        </div>
      </div>

      {/* Alternative selezionate */}
      <div className="space-y-3 mb-6">
        {interventiSelezionati.map((sel, idx) => (
          <div key={sel.intervento.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">Alternativa {idx + 1}</p>
                <h3 className="font-bold text-gray-900">{sel.intervento.categoriaIntervento}</h3>
                <p className="text-sm text-gray-500">{sel.intervento.tipoLabel}</p>
              </div>
              <p className="text-xl font-bold text-bluette-700">{formatEuro(sel.costoStimato)}</p>
            </div>

            {/* Parametri configurati */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {sel.intervento.parametri.map((param) => {
                const val = sel.parametriCustom[param.nome] ?? param.default
                return (
                  <div key={param.nome} className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-400">{param.nome}</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {val.toLocaleString('it-IT')} {param.udm}
                    </p>
                  </div>
                )
              })}
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400">Durata stimata</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatDurata(sel.intervento.durataMedio)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parametri raccolti automaticamente */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-lg">✅</span>
          <div>
            <p className="font-semibold text-green-900 text-sm mb-2">
              Parametri per CBA e EIA raccolti automaticamente
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-green-700">CAPEX</p>
                <p className="font-bold text-green-900">{formatEuro(costoTotale)}</p>
              </div>
              <div>
                <p className="text-xs text-green-700">Localizzazione</p>
                <p className="font-bold text-green-900">{ENTE.nome}</p>
              </div>
              <div>
                <p className="text-xs text-green-700">Durata</p>
                <p className="font-bold text-green-900">
                  {formatDurata(Math.max(...interventiSelezionati.map(s => s.intervento.durataMedio)))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white border-2 border-bluette-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          {multipleAlternative ? 'Avvia analisi DOCFAP' : 'Avvia analisi di valutazione'}
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          {multipleAlternative
            ? `Hai selezionato ${interventiSelezionati.length} alternative. Il DOCFAP le confronterà con l'opzione zero per identificare l'alternativa migliore.`
            : 'Hai selezionato una sola alternativa. Puoi avviare direttamente la valutazione CBA e EIA.'
          }
        </p>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/impatti/docfap')}
            className="flex-1"
          >
            {multipleAlternative ? 'Avvia DOCFAP →' : 'Avvia valutazione →'}
          </Button>
          <Button
            variant="tertiary"
            onClick={() => goToStep('entry')}
          >
            Nuova pianificazione
          </Button>
        </div>
      </div>
    </div>
  )
}