import { useState } from 'react'
import { usePlanning } from '../../PlanningContext'
import { CATEGORIE, FABBISOGNI_TIPO, type Categoria, type FabbisognoTipo } from '../../data/mockTaxonomy'
import { VALORI_ENTE, calcolaInefficienze, ENTE } from '../../data/mockDataRoom'

/* ─── Taxonomy Navigator — componente condiviso Modalità 1+2 ─── */

export function TaxonomyNavigator() {
  const { state, setState, goToStep } = usePlanning()
  const [categoriaAperta, setCategoriaAperta] = useState<string | null>(null)
  const [fabbisognoScelto, setFabbisognoScelto] = useState<FabbisognoTipo | null>(null)

  const isGuidato = state.lente === 'inefficienze'
  const inefficienze = isGuidato ? calcolaInefficienze() : []

  // Conta inefficienze per categoria
  const ineffPerCategoria = (catId: string) =>
    inefficienze.filter(i => i.categoriaId === catId)

  // Valori ente per una categoria
  const valoriCategoria = (catId: string) => {
    const cat = CATEGORIE.find(c => c.id === catId)
    if (!cat) return []
    return cat.indicatori.map(ind => {
      const val = VALORI_ENTE.find(v => v.indicatoreId === ind.id)
      const ineff = inefficienze.find(i => i.indicatoreId === ind.id)
      return { ...ind, valoreEnte: val?.valoreEnte, mediaCluster: val?.mediaCluster, gapCluster: val?.gapCluster, ineff }
    })
  }

  const handleSelectFabbisogno = (fab: FabbisognoTipo, cat: Categoria) => {
    setFabbisognoScelto(fab)
    setState({
      categoriaSelezionata: cat,
      fabbisognoSelezionato: fab,
    })
  }

  const handleProcedi = () => {
    if (fabbisognoScelto) goToStep('contesto')
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => goToStep('entry')}
          className="text-sm text-bluette-700 hover:underline"
        >
          ← Torna alla scelta
        </button>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          {isGuidato ? 'Fabbisogni guidati' : 'Selezione fabbisogno'} — {ENTE.nome}
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          {isGuidato ? 'Dove il tuo comune può migliorare' : 'In quale area vuoi intervenire?'}
        </h1>
        <p className="text-gray-500">
          {isGuidato
            ? `Gli indicatori evidenziati mostrano dove ${ENTE.nome} performa peggio rispetto a comuni simili. Seleziona un fabbisogno per procedere.`
            : 'Naviga le categorie e seleziona il fabbisogno che vuoi soddisfare.'
          }
        </p>
      </div>

      {/* Lente toggle */}
      <div className="flex items-center gap-2 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setState({ lente: 'neutra' })}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            state.lente === 'neutra' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tutte le categorie
        </button>
        <button
          onClick={() => setState({ lente: 'inefficienze' })}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            state.lente === 'inefficienze' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Inefficienze evidenziate
        </button>
      </div>

      {/* Categorie accordion */}
      <div className="space-y-3">
        {CATEGORIE.map((cat) => {
          const isOpen = categoriaAperta === cat.id
          const catIneff = ineffPerCategoria(cat.id)
          const hasCriticita = catIneff.length > 0
          const fabbisogni = FABBISOGNI_TIPO.filter(f => f.categoriaId === cat.id)

          return (
            <div
              key={cat.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all ${
                isOpen ? 'border-bluette-700 shadow-sm' : 'border-gray-200'
              }`}
            >
              {/* Categoria header */}
              <button
                onClick={() => setCategoriaAperta(isOpen ? null : cat.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl shrink-0">{cat.icona}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{cat.nome}</h3>
                    {isGuidato && hasCriticita && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        catIneff.some(i => i.severita === 'critica')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {catIneff.length} criticit{catIneff.length === 1 ? 'à' : 'à'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{cat.descrizione}</p>
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 pb-5">
                  {/* Indicatori con valori ente */}
                  {isGuidato && (
                    <div className="mt-4 mb-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Indicatori — {ENTE.nome} vs cluster
                      </p>
                      <div className="space-y-2">
                        {valoriCategoria(cat.id).map((ind) => (
                          <div
                            key={ind.id}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
                              ind.ineff
                                ? ind.ineff.severita === 'critica'
                                  ? 'bg-red-50'
                                  : ind.ineff.severita === 'alta'
                                  ? 'bg-amber-50'
                                  : 'bg-gray-50'
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-700">{ind.nome}</span>
                              {ind.ineff && (
                                <span className={`ml-2 text-xs font-bold ${
                                  ind.ineff.severita === 'critica' ? 'text-red-600' :
                                  ind.ineff.severita === 'alta' ? 'text-amber-600' : 'text-gray-500'
                                }`}>
                                  {ind.ineff.severita === 'critica' ? '⚠ Critica' :
                                   ind.ineff.severita === 'alta' ? '⚡ Alta' : '● Media'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 shrink-0 text-right">
                              <div>
                                <span className="text-xs text-gray-400 block">{ENTE.nome}</span>
                                <span className="font-semibold text-gray-900">
                                  {ind.valoreEnte?.toLocaleString('it-IT')} {ind.udm}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-400 block">Cluster</span>
                                <span className="text-gray-600">
                                  {ind.mediaCluster?.toLocaleString('it-IT')} {ind.udm}
                                </span>
                              </div>
                              {ind.gapCluster !== undefined && (
                                <span className={`text-xs font-bold w-14 text-right ${
                                  Math.abs(ind.gapCluster) > 30 ? 'text-red-600' :
                                  Math.abs(ind.gapCluster) > 15 ? 'text-amber-600' : 'text-gray-400'
                                }`}>
                                  {ind.gapCluster > 0 ? '+' : ''}{ind.gapCluster.toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fabbisogni selezionabili */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Fabbisogni disponibili
                    </p>
                    <div className="space-y-2">
                      {fabbisogni.map((fab) => {
                        const isSelected = fabbisognoScelto?.id === fab.id
                        // Evidenzia se collegato a inefficienze
                        const collegato = isGuidato && fab.indicatoriCorrelati.some(
                          indId => catIneff.some(i => i.indicatoreId === indId)
                        )
                        const isCritico = collegato && fab.indicatoriCorrelati.some(
                          indId => catIneff.some(i => i.indicatoreId === indId && i.severita === 'critica')
                        )

                        return (
                          <button
                            key={fab.id}
                            onClick={() => handleSelectFabbisogno(fab, cat)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-bluette-700 bg-bluette-50'
                                : isCritico
                                ? 'border-red-300 bg-red-50 hover:border-bluette-700'
                                : collegato
                                ? 'border-amber-300 bg-amber-50 hover:border-bluette-700'
                                : 'border-gray-200 hover:border-bluette-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-bluette-700 bg-bluette-700' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{fab.nome}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{fab.descrizione}</p>
                              </div>
                              {isCritico && !isSelected && (
                                <span className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                                  Critica
                                </span>
                              )}
                              {collegato && !isCritico && !isSelected && (
                                <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                                  Suggerito
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom action */}
      {fabbisognoScelto && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Fabbisogno selezionato</p>
            <p className="font-bold text-gray-900">{fabbisognoScelto.nome}</p>
          </div>
          <button
            onClick={handleProcedi}
            className="bg-bluette-700 hover:bg-bluette-900 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Procedi →
          </button>
        </div>
      )}
    </div>
  )
}
