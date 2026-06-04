import { useMemo, useState } from 'react'
import { usePlanning } from '../../PlanningContext'
import { calcolaInefficienze, ENTE, type Inefficienza } from '../../data/mockDataRoom'
import { CATEGORIE, FABBISOGNI_TIPO, type FabbisognoTipo } from '../../data/mockTaxonomy'
import { getInterventiPerFabbisogno, type InterventoMOP } from '../../data/mockMOP'
import { matchInterventoConDUP, MOCK_DUP, type DUPMatch } from '../../data/mockDUP'

/* ─── Portfolio Builder — Modalità 3: ranking urgenza + selezione fabbisogno ─── */

const formatEuro = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const formatDurata = (mesi: number) =>
  mesi >= 12 ? `${Math.floor(mesi / 12)} ann${Math.floor(mesi / 12) === 1 ? 'o' : 'i'}${mesi % 12 ? ` ${mesi % 12}m` : ''}` : `${mesi} mesi`

interface AreaPrioritaria {
  fabbisogno: FabbisognoTipo
  categoria: typeof CATEGORIE[number]
  inefficienza: Inefficienza
  interventiDisponibili: InterventoMOP[]
  dupMatch: DUPMatch
  scoreUrgenza: number
  rangeCapex: { min: number; max: number }
  rangeDurata: { min: number; max: number }
}

function buildRanking(dupCaricato: boolean): AreaPrioritaria[] {
  const inefficienze = calcolaInefficienze()
  const aree: AreaPrioritaria[] = []

  for (const ineff of inefficienze) {
    const fabbisogni = FABBISOGNI_TIPO.filter(
      f => f.categoriaId === ineff.categoriaId && f.indicatoriCorrelati.includes(ineff.indicatoreId)
    )

    for (const fab of fabbisogni) {
      if (aree.some(a => a.fabbisogno.id === fab.id)) continue

      const interventi = getInterventiPerFabbisogno(fab.id)
      if (interventi.length === 0) continue

      const cat = CATEGORIE.find(c => c.id === ineff.categoriaId)!
      const best = [...interventi].sort((a, b) => a.capexMedio - b.capexMedio)[0]
      const dupMatch = dupCaricato ? matchInterventoConDUP(best.categoriaIntervento, ineff.categoriaId) : { level: 'non_previsto' as const, label: '' }

      const scoreUrgenza = Math.min(100, Math.abs(ineff.gapCluster) * 1.3)

      aree.push({
        fabbisogno: fab,
        categoria: cat,
        inefficienza: ineff,
        interventiDisponibili: interventi,
        dupMatch,
        scoreUrgenza,
        rangeCapex: {
          min: Math.min(...interventi.map(i => i.capexMin)),
          max: Math.max(...interventi.map(i => i.capexMax)),
        },
        rangeDurata: {
          min: Math.min(...interventi.map(i => i.durataMin)),
          max: Math.max(...interventi.map(i => i.durataMax)),
        },
      })
    }
  }

  return aree.sort((a, b) => b.scoreUrgenza - a.scoreUrgenza)
}

const SEVERITA_COLORS: Record<string, string> = {
  critica: 'bg-red-100 text-red-700',
  alta: 'bg-amber-100 text-amber-700',
  media: 'bg-gray-100 text-gray-600',
}

const DUP_MATCH_COLORS: Record<string, string> = {
  pieno: 'bg-green-100 text-green-700 border-green-200',
  parziale: 'bg-blue-50 text-blue-700 border-blue-200',
  non_previsto: 'bg-gray-50 text-gray-500 border-gray-200',
}

const DUP_MATCH_ICONS: Record<string, string> = {
  pieno: '✅',
  parziale: '🔗',
  non_previsto: '🆕',
}

export function PortfolioBuilder() {
  const { state, setState, goToStep } = usePlanning()
  const { budgetTotaleProgrammazione, orizzonteTemporaleMesi, dupCaricato } = state

  const ranking = useMemo(() => buildRanking(dupCaricato), [dupCaricato])
  
  // Stato per tracciare l'intervento selezionato per ogni fabbisogno
  const [selectedInterventi, setSelectedInterventi] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    const inefficienze = calcolaInefficienze()
    for (const ineff of inefficienze) {
      const fabbisogni = FABBISOGNI_TIPO.filter(
        f => f.categoriaId === ineff.categoriaId && f.indicatoriCorrelati.includes(ineff.indicatoreId)
      )
      for (const fab of fabbisogni) {
        const interventi = getInterventiPerFabbisogno(fab.id)
        if (interventi.length > 0) {
          // Intervento più economico di default
          const suggested = interventi.reduce((min, curr) => 
            curr.capexMedio < min.capexMedio ? curr : min
          )
          initial[fab.id] = suggested.id
        }
      }
    }
    return initial
  })

  // Calcola il costo totale in base alla selezione
  const costoTotalePiano = useMemo(() => {
    return ranking.reduce((total, area) => {
      const interventoId = selectedInterventi[area.fabbisogno.id]
      if (interventoId) {
        const intervento = area.interventiDisponibili.find(i => i.id === interventoId)
        if (intervento) {
          return total + intervento.capexMedio
        }
      }
      return total
    }, 0)
  }, [selectedInterventi, ranking])

  // Stato per tracciare quali aree hanno le alternative espanse
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set())

  const toggleExpandArea = (fabbisognoId: string) => {
    const newExpanded = new Set(expandedAreas)
    if (newExpanded.has(fabbisognoId)) {
      newExpanded.delete(fabbisognoId)
    } else {
      newExpanded.add(fabbisognoId)
    }
    setExpandedAreas(newExpanded)
  }

  // Ottiene l'intervento suggerito (il più economico)
  const getSuggestedIntervento = (interventi: InterventoMOP[]): InterventoMOP => {
    return interventi.reduce((min, curr) => 
      curr.capexMedio < min.capexMedio ? curr : min
    )
  }

  // Ottiene le alternative rimanenti (escluso il suggerito)
  const getAlternativeInterventi = (interventi: InterventoMOP[], suggestedId: string): InterventoMOP[] => {
    return interventi.filter(i => i.id !== suggestedId)
  }

  const handleSelezionaIntervento = (fabbisognoId: string, interventoId: string) => {
    setSelectedInterventi(prev => ({
      ...prev,
      [fabbisognoId]: interventoId
    }))
  }

  const handleSelezionaFabbisogno = (area: AreaPrioritaria) => {
    setState({
      categoriaSelezionata: area.categoria,
      fabbisognoSelezionato: area.fabbisogno,
      capexMax: budgetTotaleProgrammazione,
    })
    goToStep('interventi')
  }

  return (
    <div className="overflow-visible">
      <div className="max-w-4xl mx-auto px-8 py-8 relative">
      {/* Back */}
      <button
        onClick={() => goToStep('vincoli')}
        className="text-sm text-bluette-700 hover:underline mb-6 block"
      >
        ← Modifica budget e orizzonte
      </button>

      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          Pianificazione Completa — {ENTE.nome}
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Criticità del territorio
        </h1>
        <p className="text-gray-500">
          Il sistema ha analizzato gli indicatori di {ENTE.nome} rispetto al cluster di comuni simili 
          e ha identificato le aree di maggiore criticità. Seleziona un fabbisogno per esplorare 
          le alternative di intervento e confrontarle.
        </p>
      </div>

      {/* Contesto */}
      <div className="sticky top-14 z-10 bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Budget programmazione</p>
            <p className="text-lg font-bold text-gray-900">{formatEuro(budgetTotaleProgrammazione)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Costo totale piano</p>
            <p className="text-lg font-bold text-bluette-700">{formatEuro(costoTotalePiano)}</p>
            {costoTotalePiano > budgetTotaleProgrammazione && (
              <p className="text-xs text-red-600 mt-1">⚠ Supera budget</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Orizzonte</p>
            <p className="text-lg font-bold text-gray-900">{formatDurata(orizzonteTemporaleMesi)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Criticità rilevate</p>
            <p className="text-lg font-bold text-gray-900">{ranking.length}</p>
          </div>
        </div>
      </div>

      {/* DUP matching summary */}
      {dupCaricato && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Coerenza con DUP {MOCK_DUP.triennio}:</span>
          <div className="flex items-center gap-3">
            {ranking.filter(a => a.dupMatch.level === 'pieno').length > 0 && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                ✅ {ranking.filter(a => a.dupMatch.level === 'pieno').length} allineate
              </span>
            )}
            {ranking.filter(a => a.dupMatch.level === 'parziale').length > 0 && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                🔗 {ranking.filter(a => a.dupMatch.level === 'parziale').length} coerenti
              </span>
            )}
            {ranking.filter(a => a.dupMatch.level === 'non_previsto').length > 0 && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                🆕 {ranking.filter(a => a.dupMatch.level === 'non_previsto').length} nuove
              </span>
            )}
          </div>
        </div>
      )}

      {/* Ranking */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
          Fabbisogni per urgenza ({ranking.length})
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Ordinati per criticità rispetto al cluster. Per ogni fabbisogno sono disponibili diverse tipologie di intervento 
          con costi e tempi diversi — il confronto avviene nello step successivo.
        </p>
        <div className="space-y-3">
          {ranking.map((area, idx) => (
            <div key={area.fabbisogno.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-bluette-300 transition-colors">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      area.inefficienza.severita === 'critica' ? 'bg-red-600 text-white' :
                      area.inefficienza.severita === 'alta' ? 'bg-amber-500 text-white' :
                      'bg-gray-300 text-gray-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{area.fabbisogno.nome}</h3>
                      <p className="text-sm text-gray-500">{area.categoria.icona} {area.categoria.nome}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {/* Urgenza bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            area.scoreUrgenza > 70 ? 'bg-red-500' : area.scoreUrgenza > 40 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${area.scoreUrgenza}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${
                        area.scoreUrgenza > 70 ? 'text-red-600' : area.scoreUrgenza > 40 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {area.scoreUrgenza.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">urgenza</p>
                  </div>
                </div>

                {/* Badge row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEVERITA_COLORS[area.inefficienza.severita]}`}>
                    {area.inefficienza.severita === 'critica' ? '⚠ Criticità critica' :
                     area.inefficienza.severita === 'alta' ? '⚡ Criticità alta' : '● Criticità media'}
                  </span>
                  {dupCaricato && area.dupMatch.level !== 'non_previsto' && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${DUP_MATCH_COLORS[area.dupMatch.level]}`}>
                      {DUP_MATCH_ICONS[area.dupMatch.level]} {area.dupMatch.level === 'pieno' ? 'Allineata DUP' : 'Coerente DUP'}
                    </span>
                  )}
                </div>

                {/* Indicatore con gap */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{area.inefficienza.nomeIndicatore}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ENTE.nome}: <span className="font-semibold">{area.inefficienza.valoreEnte.toLocaleString('it-IT')}</span> —
                        Cluster: <span className="font-semibold">{area.inefficienza.mediaCluster.toLocaleString('it-IT')}</span>
                      </p>
                    </div>
                    <span className={`text-lg font-bold ${
                      Math.abs(area.inefficienza.gapCluster) > 30 ? 'text-red-600' :
                      Math.abs(area.inefficienza.gapCluster) > 15 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {area.inefficienza.gapCluster > 0 ? '+' : ''}{area.inefficienza.gapCluster.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* DUP detail */}
                {dupCaricato && area.dupMatch.level !== 'non_previsto' && (
                  <div className={`rounded-lg px-3 py-2 mb-3 text-xs ${
                    area.dupMatch.level === 'pieno' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {area.dupMatch.label}
                    {area.dupMatch.operaCorrispondente && (
                      <span className="ml-1 font-semibold">
                        — {formatEuro(area.dupMatch.operaCorrispondente.importo)} previsti nel DUP
                      </span>
                    )}
                  </div>
                )}

        {/* Intervento suggerito */}
                <div className="bg-gradient-to-r from-bluette-50 to-bluette-25 border border-bluette-200 rounded-lg p-4 mb-4">
                  {(() => {
                    const suggerito = getSuggestedIntervento(area.interventiDisponibili)
                    const isSelected = selectedInterventi[area.fabbisogno.id] === suggerito.id
                    return (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs font-semibold text-bluette-600 uppercase tracking-wider mb-1">
                              💡 Suggerito dal sistema
                            </p>
                            <p className="font-semibold text-gray-900 text-sm mb-1">
                              {suggerito.categoriaIntervento}
                            </p>
                            <p className="text-xs text-gray-500">
                              Intervento più efficiente per comuni del tuo cluster
                            </p>
                          </div>
                          <span className="text-lg font-bold text-bluette-700 shrink-0">
                            {formatEuro(suggerito.capexMedio)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-bluette-100 text-bluette-700 border border-bluette-300">
                            {suggerito.tipoLabel}
                          </span>
                          {isSelected && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                              ✓ Selezionato
                            </span>
                          )}
                        </div>
                        
                        {/* Bottone espandibile per le alternative */}
                        {area.interventiDisponibili.length > 1 && (
                          <div className="mt-3 pt-3 border-t border-bluette-200">
                            <button
                              onClick={() => toggleExpandArea(area.fabbisogno.id)}
                              className="text-sm font-semibold text-bluette-700 hover:text-bluette-900 flex items-center gap-2 transition-colors"
                            >
                              <span className={`transform transition-transform ${expandedAreas.has(area.fabbisogno.id) ? 'rotate-90' : ''}`}>
                                ▶
                              </span>
                              Vedi altre {area.interventiDisponibili.length - 1} alternativ{area.interventiDisponibili.length - 1 === 1 ? 'a' : 'e'}
                            </button>

                            {/* Alternative espanse */}
                            {expandedAreas.has(area.fabbisogno.id) && (
                              <div className="mt-3 space-y-2 pt-3 border-t border-bluette-100">
                                {getAlternativeInterventi(area.interventiDisponibili, suggerito.id).map(alt => {
                                  const isAltSelected = selectedInterventi[area.fabbisogno.id] === alt.id
                                  return (
                                    <button
                                      key={alt.id}
                                      onClick={() => handleSelezionaIntervento(area.fabbisogno.id, alt.id)}
                                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                        isAltSelected
                                          ? 'bg-blue-50 border-blue-300'
                                          : 'bg-white border-gray-200 hover:border-bluette-300 hover:bg-bluette-50'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <p className="font-medium text-sm text-gray-900">
                                            {alt.categoriaIntervento}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            {alt.tipoLabel}
                                          </p>
                                        </div>
                                        <span className="font-semibold text-gray-900 ml-3 shrink-0">
                                          {formatEuro(alt.capexMedio)}
                                        </span>
                                      </div>
                                      {isAltSelected && (
                                        <div className="mt-2 text-xs font-semibold text-blue-700">
                                          ✓ Attualmente selezionato
                                        </div>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* Interventi disponibili summary */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{area.interventiDisponibili.length} alternativ{area.interventiDisponibili.length === 1 ? 'a' : 'e'}</span>
                  <span>·</span>
                  <span>Da {formatEuro(area.rangeCapex.min)} a {formatEuro(area.rangeCapex.max)}</span>
                  <span>·</span>
                  <span>{area.rangeDurata.min}–{area.rangeDurata.max} mesi</span>
                </div>

                {/* Tipologie disponibili pills */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  {[...new Set(area.interventiDisponibili.map(i => i.tipoLabel))].map(tipo => (
                    <span key={tipo} className="text-xs px-2 py-0.5 rounded-full bg-bluette-50 text-bluette-700 border border-bluette-200">
                      {tipo}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSelezionaFabbisogno(area)}
                  className="w-full bg-bluette-700 hover:bg-bluette-900 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  Esplora intervento selezionato →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Export */}
      <button
        onClick={() => window.print()}
        className="w-full border-2 border-gray-300 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-6"
      >
        📄 Scarica riepilogo piano (PDF)
      </button>

      {/* Info */}
      <div className="bg-bluette-50 border border-bluette-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="font-semibold text-bluette-900 text-sm mb-1">
              Come funziona il processo
            </p>
            <p className="text-sm text-bluette-700">
              Seleziona un fabbisogno per esplorare le alternative di intervento. Per ciascuna alternativa 
              potrai calibrare i parametri dimensionali e poi avviare il DOCFAP per confrontarle. 
              Il rapporto costi-benefici e l'analisi d'impatto vengono calcolati sugli interventi concreti, non sui fabbisogni.
              Dopo aver completato un'analisi, puoi tornare qui per procedere con il fabbisogno successivo.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}