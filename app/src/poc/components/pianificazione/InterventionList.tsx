import { usePlanning, type InterventoSelezionato } from '../../PlanningContext'
import { getInterventiPerFabbisogno, filtraInterventi, type InterventoFiltrato } from '../../data/mockMOP'
import { ENTE } from '../../data/mockDataRoom'

/* ─── Ventaglio interventi con cutoff doppio (budget + tempo) ─── */

const TIPO_COLORS: Record<string, string> = {
  nuova_costruzione: 'bg-bluette-50 text-bluette-700 border-bluette-200',
  ristrutturazione: 'bg-amber-50 text-amber-700 border-amber-200',
  riqualificazione: 'bg-green-50 text-green-700 border-green-200',
  voucher_servizi: 'bg-purple-50 text-purple-700 border-purple-200',
}

const formatEuro = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const formatDurata = (mesi: number) =>
  mesi >= 12 ? `${Math.floor(mesi / 12)} ann${Math.floor(mesi / 12) === 1 ? 'o' : 'i'}${mesi % 12 ? ` ${mesi % 12}m` : ''}` : `${mesi} mesi`

export function InterventionList() {
  const { state, setState, goToStep } = usePlanning()
  const { fabbisognoSelezionato, capexMax, orizzonteTemporaleMesi } = state

  if (!fabbisognoSelezionato) {
    goToStep('taxonomy')
    return null
  }

  const interventi = getInterventiPerFabbisogno(fabbisognoSelezionato.id)
  const filtrati = filtraInterventi(interventi, { capexMax, orizzonteTemporaleMesi })

  const ammissibili = filtrati.filter(f => f.ammissibile)
  const esclusi = filtrati.filter(f => !f.ammissibile)

  const toggleSelezione = (item: InterventoFiltrato) => {
    if (!item.ammissibile) return
    const current = state.interventiSelezionati
    const exists = current.find(s => s.intervento.id === item.intervento.id)

    if (exists) {
      setState({ interventiSelezionati: current.filter(s => s.intervento.id !== item.intervento.id) })
    } else {
      const nuovo: InterventoSelezionato = {
        intervento: item.intervento,
        parametriCustom: {},
        costoStimato: item.intervento.capexMedio,
        durataStimata: item.intervento.durataMedio,
      }
      setState({ interventiSelezionati: [...current, nuovo] })
    }
  }

  const isSelected = (id: string) =>
    state.interventiSelezionati.some(s => s.intervento.id === id)

  const handleProcedi = () => {
    if (state.interventiSelezionati.length > 0) goToStep('calibrazione')
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Back */}
      <button
        onClick={() => goToStep(state.modalita === 'completo' ? 'portfolio' : 'vincoli')}
        className="text-sm text-bluette-700 hover:underline mb-6 block"
      >
        ← Modifica vincoli
      </button>

      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          Alternative disponibili
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Come soddisfare: {fabbisognoSelezionato.nome}
        </h1>
        <p className="text-gray-500">
          Interventi filtrati per {ENTE.nome} — budget max {formatEuro(capexMax)}, orizzonte {formatDurata(orizzonteTemporaleMesi)}
        </p>
      </div>

      {/* Ammissibili */}
      {ammissibili.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Interventi ammissibili ({ammissibili.length})
          </h2>
          <div className="space-y-3">
            {ammissibili.map((item) => {
              const i = item.intervento
              const selected = isSelected(i.id)
              return (
                <button
                  key={i.id}
                  onClick={() => toggleSelezione(item)}
                  className={`w-full text-left bg-white border-2 rounded-xl p-5 transition-all ${
                    selected ? 'border-bluette-700 shadow-sm' : 'border-gray-200 hover:border-bluette-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      selected ? 'border-bluette-700 bg-bluette-700' : 'border-gray-300'
                    }`}>
                      {selected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TIPO_COLORS[i.tipo] || 'bg-gray-50 text-gray-600'}`}>
                          {i.tipoLabel}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{i.categoriaIntervento}</h3>
                      <p className="text-xs text-gray-500">{i.settore} → {i.sottosettore}</p>

                      {/* Metriche */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">CAPEX medio</p>
                          <p className="font-bold text-gray-900">{formatEuro(i.capexMedio)}</p>
                          <p className="text-xs text-gray-400">{formatEuro(i.capexMin)} — {formatEuro(i.capexMax)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">OPEX annuo</p>
                          <p className="font-bold text-gray-900">{formatEuro(i.opexAnnuoMedio)}</p>
                          <p className="text-xs text-gray-400">{formatEuro(i.opexAnnuoMin)} — {formatEuro(i.opexAnnuoMax)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Durata</p>
                          <p className="font-bold text-gray-900">{formatDurata(i.durataMedio)}</p>
                          <p className="text-xs text-gray-400">{i.durataMin} — {i.durataMax} mesi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Esclusi — cutoff morbido */}
      {esclusi.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Fuori portata attuale ({esclusi.length})
          </h2>
          <div className="space-y-3">
            {esclusi.map((item) => {
              const i = item.intervento
              return (
                <div
                  key={i.id}
                  className="w-full text-left bg-gray-50 border border-gray-200 rounded-xl p-5 opacity-70"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-md border-2 border-gray-200 bg-gray-100 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                          {i.tipoLabel}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.motivoEsclusione === 'budget' ? 'bg-red-100 text-red-600' :
                          item.motivoEsclusione === 'tempo' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {item.motivoEsclusione === 'budget' ? `CAPEX ${formatEuro(i.capexMedio)} > budget` :
                           item.motivoEsclusione === 'tempo' ? `Durata ${i.durataMedio}m > orizzonte` :
                           'Supera budget e tempo'}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-600 mb-1">{i.categoriaIntervento}</h3>
                      <p className="text-xs text-gray-400">{i.settore} → {i.sottosettore}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => goToStep('vincoli')}
            className="mt-3 text-sm text-bluette-700 hover:underline font-medium"
          >
            Modifica vincoli per includere queste alternative →
          </button>
        </div>
      )}

      {/* Nessun intervento ammissibile */}
      {ammissibili.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🚫</p>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Nessun intervento ammissibile</h3>
          <p className="text-gray-500 mb-6">Con i vincoli attuali non ci sono alternative disponibili.</p>
          <button
            onClick={() => goToStep('vincoli')}
            className="bg-bluette-700 hover:bg-bluette-900 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Modifica vincoli →
          </button>
        </div>
      )}

      {/* Bottom action */}
      {state.interventiSelezionati.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{state.interventiSelezionati.length} alternativ{state.interventiSelezionati.length === 1 ? 'a' : 'e'} selezionat{state.interventiSelezionati.length === 1 ? 'a' : 'e'}</p>
            <p className="font-bold text-gray-900">
              {state.interventiSelezionati.map(s => s.intervento.tipoLabel).join(' + ')}
            </p>
          </div>
          <button
            onClick={handleProcedi}
            className="bg-bluette-700 hover:bg-bluette-900 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Calibra parametri →
          </button>
        </div>
      )}
    </div>
  )
}
