import { usePlanning } from '../../PlanningContext'
import { ENTE, VALORI_ENTE } from '../../data/mockDataRoom'
import { Button } from '../ds'

/* ─── Screening contesto ente per il fabbisogno selezionato ─── */

export function EnteContext() {
  const { state, goToStep } = usePlanning()
  const { fabbisognoSelezionato, categoriaSelezionata } = state

  if (!fabbisognoSelezionato || !categoriaSelezionata) {
    goToStep('taxonomy')
    return null
  }

  // Indicatori correlati al fabbisogno
  const indicatoriCorrelati = categoriaSelezionata.indicatori.filter(
    ind => fabbisognoSelezionato.indicatoriCorrelati.includes(ind.id)
  )

  const valoriCorrelati = indicatoriCorrelati.map(ind => {
    const val = VALORI_ENTE.find(v => v.indicatoreId === ind.id)
    return { ...ind, ...val }
  })

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Back */}
      <button
        onClick={() => goToStep('taxonomy')}
        className="text-sm text-bluette-700 hover:underline mb-6 block"
      >
        ← Torna alla selezione
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          Contesto territoriale
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          {fabbisognoSelezionato.nome}
        </h1>
        <p className="text-gray-500">
          Ecco la situazione attuale di {ENTE.nome} sugli indicatori legati a questo fabbisogno, confrontata con il cluster di riferimento.
        </p>
      </div>

      {/* Card ente */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Comune</p>
            <p className="font-bold text-gray-900">{ENTE.nome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Popolazione</p>
            <p className="font-bold text-gray-900">{ENTE.popolazione.toLocaleString('it-IT')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Cluster</p>
            <p className="font-bold text-gray-900">{ENTE.cluster}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Categoria</p>
            <p className="font-bold text-gray-900">{categoriaSelezionata.icona} {categoriaSelezionata.nome}</p>
          </div>
        </div>
      </div>

      {/* Indicatori correlati */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Indicatori correlati al fabbisogno</h3>
          <p className="text-xs text-gray-500 mt-1">Confronto {ENTE.nome} vs cluster di comuni simili</p>
        </div>

        <div className="divide-y divide-gray-100">
          {valoriCorrelati.map((ind) => {
            const valEnte = ind.valoreEnte ?? 0
            const valCluster = ind.mediaCluster ?? 0
            const gap = ind.gapCluster ?? 0
            const gapAbs = Math.abs(gap)
            const isCritico = gapAbs > 25
            const isAlto = gapAbs > 15

            return (
              <div key={ind.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{ind.nome}</p>
                    <p className="text-xs text-gray-500">{ind.descrizione}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isCritico ? 'bg-red-100 text-red-700' :
                    isAlto ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {isCritico ? 'Critico' : isAlto ? 'Da migliorare' : 'Nella norma'}
                  </span>
                </div>

                {/* Bar comparison */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{ENTE.nome}: {valEnte.toLocaleString('it-IT')} {ind.udm}</span>
                      <span>Cluster: {valCluster.toLocaleString('it-IT')} {ind.udm}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${
                          isCritico ? 'bg-red-400' : isAlto ? 'bg-amber-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(100, (valEnte / Math.max(valEnte, valCluster)) * 100)}%` }}
                      />
                      {/* Cluster marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-gray-600"
                        style={{ left: `${Math.min(100, (valCluster / Math.max(valEnte, valCluster)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-bold w-16 text-right ${
                    isCritico ? 'text-red-600' : isAlto ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {gap > 0 ? '+' : ''}{gap.toFixed(0)}{ind.udm === '%' ? '%' : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insight AI */}
      <div className="bg-bluette-50 border border-bluette-200 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="font-semibold text-bluette-900 text-sm mb-1">Insight</p>
            <p className="text-sm text-bluette-800">
              {ENTE.nome} presenta criticità significative su questo fabbisogno rispetto a comuni di dimensioni simili. 
              Comuni del cluster "{ENTE.cluster}" con caratteristiche analoghe hanno storicamente investito tra il 15% e il 25% 
              del budget annuale opere pubbliche per interventi in questa area.
            </p>
          </div>
        </div>
      </div>

      {/* Procedi */}
      <div className="flex justify-end">
        <Button onClick={() => goToStep('vincoli')}>
          Definisci vincoli →
        </Button>
      </div>
    </div>
  )
}