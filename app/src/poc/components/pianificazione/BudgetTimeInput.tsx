import { useState } from 'react'
import { usePlanning } from '../../PlanningContext'
import { Button } from '../ds'
import { ENTE } from '../../data/mockDataRoom'
import { MOCK_DUP } from '../../data/mockDUP'

/* ─── Input vincoli: budget + tempo + upload DUP simulato ─── */

const formatEuro = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export function BudgetTimeInput() {
  const { state, setState, goToStep } = usePlanning()
  const isModCompleto = state.modalita === 'completo'

  const [capex, setCapex] = useState(state.capexMax || 0)
  const [opex, setOpex] = useState(state.opexAnnuoMax || 0)
  const [mesi, setMesi] = useState(state.orizzonteTemporaleMesi || 24)
  const [budgetTotale, setBudgetTotale] = useState(state.budgetTotaleProgrammazione || 0)

  // DUP upload simulation
  const [dupUploaded, setDupUploaded] = useState(false)
  const [dupLoading, setDupLoading] = useState(false)

  const canProceed = isModCompleto
    ? budgetTotale > 0 && mesi > 0
    : capex > 0 && mesi > 0

  const handleDUPUpload = () => {
    setDupLoading(true)
    // Simula parsing del documento
    setTimeout(() => {
      setDupLoading(false)
      setDupUploaded(true)
      setBudgetTotale(MOCK_DUP.budgetDisponibileNuoveOpere)
      setState({ dupCaricato: true })
      setMesi(MOCK_DUP.orizzonteAnni * 12)
    }, 2000)
  }

  const handleProcedi = () => {
    if (isModCompleto) {
      setState({
        budgetTotaleProgrammazione: budgetTotale,
        orizzonteTemporaleMesi: mesi,
      })
      goToStep('portfolio')
    } else {
      setState({
        capexMax: capex,
        opexAnnuoMax: opex,
        orizzonteTemporaleMesi: mesi,
      })
      goToStep('interventi')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Back */}
      <button
        onClick={() => goToStep(isModCompleto ? 'entry' : 'contesto')}
        className="text-sm text-bluette-700 hover:underline mb-6 block"
      >
        ← Torna indietro
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          {isModCompleto ? 'Pianificazione Completa' : 'Vincoli dell\'intervento'}
        </p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          {isModCompleto ? 'Quanto budget hai a disposizione?' : 'Definisci i vincoli del tuo intervento'}
        </h1>
        <p className="text-gray-500">
          {isModCompleto
            ? 'Carica il DUP per estrarre automaticamente budget e priorità, oppure inserisci i dati manualmente.'
            : 'Il sistema filtrerà le alternative in base a quanto puoi investire e ai tempi disponibili.'
          }
        </p>
      </div>

      {/* Contesto ente card */}
      <div className="bg-bluette-50 border border-bluette-200 rounded-xl p-5 mb-8">
        <p className="text-xs font-semibold text-bluette-700 uppercase tracking-wider mb-3">
          Contesto ente
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Comune</p>
            <p className="font-semibold text-gray-900 text-sm">{ENTE.nome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Popolazione</p>
            <p className="font-semibold text-gray-900 text-sm">{ENTE.popolazione.toLocaleString('it-IT')} ab.</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Provincia</p>
            <p className="font-semibold text-gray-900 text-sm">{ENTE.provincia}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cluster</p>
            <p className="font-semibold text-gray-900 text-sm">{ENTE.cluster}</p>
          </div>
        </div>

        {!isModCompleto && state.fabbisognoSelezionato && (
          <div className="mt-4 pt-4 border-t border-bluette-200">
            <p className="text-xs text-gray-500">Fabbisogno selezionato</p>
            <p className="font-semibold text-gray-900">{state.fabbisognoSelezionato.nome}</p>
          </div>
        )}
      </div>

      {/* DUP Upload — solo Modalità 3 */}
      {isModCompleto && (
        <div className="mb-8">
          {!dupUploaded ? (
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dupLoading ? 'border-bluette-300 bg-bluette-50' : 'border-gray-300 hover:border-bluette-400'
            }`}>
              {dupLoading ? (
                <div>
                  <div className="w-12 h-12 border-4 border-bluette-200 border-t-bluette-700 rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-semibold text-bluette-700 mb-1">Analisi del DUP in corso...</p>
                  <p className="text-sm text-gray-500">Estrazione budget, linee strategiche e opere previste</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="font-semibold text-gray-900 mb-1">Carica il DUP del tuo comune</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Il sistema estrarrà automaticamente il budget disponibile, l'orizzonte temporale e le linee strategiche.
                  </p>
                  <Button onClick={handleDUPUpload}>
                    Simula caricamento DUP →
                  </Button>
                  <p className="text-xs text-gray-400 mt-3">Formati supportati: PDF, DOCX — Max 20MB</p>
                </div>
              )}
            </div>
          ) : (
            /* DUP caricato — mostra dati estratti */
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-lg">✅</span>
                <div>
                  <p className="font-semibold text-green-900">DUP {MOCK_DUP.triennio} — Dati estratti con successo</p>
                  <p className="text-sm text-green-700">
                    Budget investimenti: {formatEuro(MOCK_DUP.budgetTotaleInvestimenti)} — 
                    Disponibile nuove opere: {formatEuro(MOCK_DUP.budgetDisponibileNuoveOpere)}
                  </p>
                </div>
              </div>

              {/* Linee strategiche estratte */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-green-800 uppercase tracking-wider mb-2">
                  {MOCK_DUP.lineeStrategiche.length} linee strategiche individuate
                </p>
                <div className="space-y-1.5">
                  {MOCK_DUP.lineeStrategiche.map(ls => (
                    <div key={ls.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-900 font-medium">{ls.titolo}</span>
                      <span className="text-sm font-bold text-green-700">{formatEuro(ls.budgetAllocato)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opere già previste */}
              <div>
                <p className="text-xs font-semibold text-green-800 uppercase tracking-wider mb-2">
                  {MOCK_DUP.operePreviste.length} opere già previste nel DUP
                </p>
                <div className="space-y-1.5">
                  {MOCK_DUP.operePreviste.map(op => (
                    <div key={op.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          op.stato === 'in_corso' ? 'bg-amber-400' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm text-gray-700">{op.titolo}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatEuro(op.importo)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setDupUploaded(false); setBudgetTotale(0); setMesi(24); setState({ dupCaricato: false }) }}
                className="mt-3 text-xs text-green-700 hover:underline"
              >
                Rimuovi DUP e inserisci manualmente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form vincoli */}
      <div className="space-y-6">
        {isModCompleto ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Budget disponibile nuove opere (€)
              {dupUploaded && <span className="text-green-600 font-normal ml-2">— estratto dal DUP</span>}
            </label>
            <input
              type="number"
              value={budgetTotale || ''}
              onChange={(e) => setBudgetTotale(Number(e.target.value))}
              placeholder="Es. 5.000.000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-bluette-700 focus:ring-1 focus:ring-bluette-700"
            />
            {budgetTotale > 0 && (
              <p className="text-sm text-gray-500 mt-1">{formatEuro(budgetTotale)}</p>
            )}
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget massimo investimento — CAPEX (€)
              </label>
              <input
                type="number"
                value={capex || ''}
                onChange={(e) => setCapex(Number(e.target.value))}
                placeholder="Es. 1.500.000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-bluette-700 focus:ring-1 focus:ring-bluette-700"
              />
              {capex > 0 && (
                <p className="text-sm text-gray-500 mt-1">{formatEuro(capex)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OPEX annuo massimo sostenibile (€)
                <span className="font-normal text-gray-400 ml-1">— opzionale</span>
              </label>
              <input
                type="number"
                value={opex || ''}
                onChange={(e) => setOpex(Number(e.target.value))}
                placeholder="Es. 100.000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-bluette-700 focus:ring-1 focus:ring-bluette-700"
              />
              {opex > 0 && (
                <p className="text-sm text-gray-500 mt-1">{formatEuro(opex)}</p>
              )}
            </div>
          </>
        )}

        {/* Orizzonte temporale */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Orizzonte temporale
            {dupUploaded && <span className="text-green-600 font-normal ml-2">— estratto dal DUP</span>}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={3}
              max={60}
              step={3}
              value={mesi}
              onChange={(e) => setMesi(Number(e.target.value))}
              className="flex-1 accent-bluette-700"
            />
            <span className="text-lg font-bold text-gray-900 w-24 text-right">
              {mesi >= 12 ? `${Math.floor(mesi / 12)} ann${Math.floor(mesi / 12) === 1 ? 'o' : 'i'}${mesi % 12 ? ` ${mesi % 12}m` : ''}` : `${mesi} mesi`}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>3 mesi</span>
            <span>5 anni</span>
          </div>
        </div>
      </div>

      {/* Procedi */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleProcedi}
          disabled={!canProceed}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors ${
            canProceed
              ? 'bg-bluette-700 hover:bg-bluette-900 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isModCompleto ? 'Genera piano opere →' : 'Mostra alternative →'}
        </button>
      </div>
    </div>
  )
}