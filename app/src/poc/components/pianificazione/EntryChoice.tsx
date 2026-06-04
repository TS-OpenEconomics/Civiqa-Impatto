import { usePlanning } from '../../PlanningContext'
import { ENTE } from '../../data/mockDataRoom'

/* ─── Entry point: scelta della modalità ─── */

const MODALITA = [
  {
    id: 'diretto' as const,
    titolo: 'So cosa voglio fare',
    descrizione: 'Hai già in mente un fabbisogno da soddisfare. Ti guidiamo nella scelta dell\'intervento più adatto, con stima di costi e tempi.',
    icona: '🎯',
    step: 'taxonomy' as const,
    lente: 'neutra' as const,
  },
  {
    id: 'guidato' as const,
    titolo: 'Aiutami a capire',
    descrizione: 'Parti dai dati del tuo territorio. Ti mostriamo dove il tuo comune performa peggio rispetto a comuni simili e ti suggeriamo dove intervenire.',
    icona: '🔍',
    step: 'taxonomy' as const,
    lente: 'inefficienze' as const,
  },
  {
    id: 'completo' as const,
    titolo: 'Pianificazione Completa',
    descrizione: 'Inserisci il budget complessivo di programmazione. Il sistema costruisce automaticamente un piano opere ottimizzato per il tuo territorio.',
    icona: '📋',
    step: 'vincoli' as const,
    lente: 'inefficienze' as const,
  },
]

export function EntryChoice() {
  const { setState, goToStep } = usePlanning()

  const handleSelect = (mod: typeof MODALITA[number]) => {
    setState({
      modalita: mod.id,
      lente: mod.lente,
    })
    goToStep(mod.step)
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-bluette-700 uppercase tracking-wider mb-2">
          Fabbisogni
        </p>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
          Da dove vuoi partire?
        </h1>
        <p className="text-gray-500 text-lg">
          Stai lavorando come <span className="font-semibold text-gray-700">{ENTE.nome}</span> — {ENTE.popolazione.toLocaleString('it-IT')} abitanti, {ENTE.provincia} ({ENTE.regione})
        </p>
      </div>

      {/* Cards modalità */}
      <div className="grid gap-5">
        {MODALITA.map((mod) => (
          <button
            key={mod.id}
            onClick={() => handleSelect(mod)}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-bluette-700 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-5">
              <div className="text-3xl shrink-0 mt-1">{mod.icona}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-bluette-700 transition-colors mb-2">
                  {mod.titolo}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {mod.descrizione}
                </p>
              </div>
              <div className="shrink-0 mt-2 text-gray-300 group-hover:text-bluette-700 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
