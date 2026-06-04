/* ══════════════════════════════════════════════════════════════
   StepLocalizzazione.tsx — Step 10: Project location(s)
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import type { ProjectLocation } from '../../../contexts/ValutazioneWizardContext'
import { WizardSectionCard, WizardStepHeader } from './primitives'

/* ─── Mock autocomplete data ─── */
const MOCK_PLACES = [
  'Vibo Valentia - Intero Comune',
  'Via Vibio Mariano - 89900, Vibo Valentia, VV',
  'Via Potiri 1 - 89900, Vibo Valentia, VV',
  'Via Potiri 2 - 89900, Vibo Valentia, VV',
  'Roma - Intero Comune',
  'Via Roma 1 - 00100, Roma, RM',
  'Milano - Intero Comune',
  'Via Milano 5 - 20100, Milano, MI',
  'Napoli - Intero Comune',
  'Torino - Intero Comune',
  'Corso Umberto I - 89900, Vibo Valentia, VV',
  'Via Reggio Calabria - 89100, Reggio Calabria, RC',
  'Via Cosenza 4 - 87100, Cosenza, CS',
  'Catanzaro - Intero Comune',
  'Crotone - Intero Comune',
  'Palermo - Intero Comune',
  'Firenze - Intero Comune',
  'Bologna - Intero Comune',
]

function genId(): string {
  return `loc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/* ─── Location pin SVG for the map placeholder ─── */
function IconMapPin() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3C11.582 3 8 6.582 8 11c0 6.627 8 18 8 18s8-11.373 8-18c0-4.418-3.582-8-8-8z"
        stroke="#9CA3AF" strokeWidth="1.5" fill="none"
      />
      <circle cx="16" cy="11" r="3" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

/* ─── Search icon ─── */
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Trash icon ─── */
function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 3h12M4 3V2a1 1 0 011-1h4a1 1 0 011 1v1M5 6v5M9 6v5M2 3l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Single location card ─── */
interface LocationCardProps {
  location: ProjectLocation
  onUpdate: (id: string, address: string) => void
  onDelete: (id: string) => void
  canDelete: boolean
}

function LocationCard({ location, onUpdate, onDelete, canDelete }: LocationCardProps) {
  const [query, setQuery] = useState(location.address)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    onUpdate(location.id, '')  // clear confirmed selection when typing

    if (val.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const lower = val.toLowerCase()
    const filtered = MOCK_PLACES.filter(p => p.toLowerCase().includes(lower)).slice(0, 5)
    setSuggestions(filtered)
    setOpen(filtered.length > 0)
  }

  const handleSelect = (place: string) => {
    setQuery(place)
    onUpdate(location.id, place)
    setSuggestions([])
    setOpen(false)
  }

  const isConfirmed = !!location.address

  return (
    <div className="border border-gray-200 bg-white mb-4" style={{ boxShadow: '0px 4px 4px rgba(0,0,0,0.06)' }}>
      <div className="flex min-h-[120px]">
        {/* Left: search input */}
        <div className="flex-1 p-4 border-r border-gray-200" ref={containerRef}>
          <div className="relative">
            <div className="flex items-center border border-gray-300 focus-within:border-bluette-700 transition-colors">
              <span className="pl-3 text-gray-400">
                <IconSearch />
              </span>
              <input
                type="text"
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                placeholder="Cerca indirizzo o località..."
                className="flex-1 px-2 py-2.5 text-sm text-gray-800 bg-transparent focus:outline-none"
                style={{ borderRadius: 0 }}
                aria-label="Indirizzo o località"
                aria-expanded={open}
                aria-haspopup="listbox"
                role="combobox"
                aria-autocomplete="list"
              />
            </div>

            {/* Autocomplete dropdown */}
            {open && (
              <ul
                role="listbox"
                className="absolute z-20 left-0 right-0 border border-gray-200 bg-white"
                style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.12)' }}
              >
                {suggestions.map((s, idx) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={() => handleSelect(s)}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors
                        ${idx === 0
                          ? 'bg-bluette-50 text-bluette-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      role="option"
                      aria-selected={idx === 0}
                    >
                      {idx === 0 && (
                        <span className="text-xs font-semibold text-bluette-700 mr-2 uppercase tracking-wide">
                          Suggerito
                        </span>
                      )}
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirmed address + delete link */}
          {isConfirmed && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-600 font-medium">{location.address}</p>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(location.id)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Elimina localizzazione
                  <IconTrash />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: map placeholder */}
        <div className="w-48 flex-shrink-0 bg-gray-100 flex flex-col items-center justify-center p-3 text-center">
          <IconMapPin />
          {isConfirmed ? (
            <p className="text-xs text-gray-500 mt-2 leading-snug">
              Posizione confermata
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-2 leading-snug">
              Inserisci l'indirizzo per visualizzare la posizione anche in mappa.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Main step component ─── */
export function StepLocalizzazione() {
  const { state, setState } = useValutazioneWizard()

  // Initialize with 1 empty location if none exist
  const locations = state.locations.length > 0
    ? state.locations
    : [{ id: genId(), address: '' }]

  // Sync to state if we just initialized
  const initialized = state.locations.length > 0

  const setLocations = (locs: ProjectLocation[]) => {
    setState({ locations: locs })
  }

  // If not yet initialized, push the starter loc into state
  const handleMount = () => {
    if (!initialized) {
      setState({ locations: [{ id: genId(), address: '' }] })
    }
  }

  // Use effect equivalent inline — this is called once at render
  // We rely on the state being initialized above before rendering

  const handleUpdate = (id: string, address: string) => {
    const updated = locations.map(l => l.id === id ? { ...l, address } : l)
    setLocations(updated)
  }

  const handleDelete = (id: string) => {
    const updated = locations.filter(l => l.id !== id)
    setLocations(updated.length > 0 ? updated : [{ id: genId(), address: '' }])
  }

  const handleAdd = () => {
    if (locations.length >= 5) return
    // Only add if last location has an address
    const last = locations[locations.length - 1]
    if (!last.address) return
    setLocations([...locations, { id: genId(), address: '' }])
  }

  const lastHasAddress = locations.length > 0 && !!locations[locations.length - 1].address
  const canAdd = locations.length < 5 && lastHasAddress

  // Trigger initialization
  if (!initialized) {
    handleMount()
  }

  return (
    <div>
      <WizardStepHeader
        title="Dove avrà luogo il tuo progetto?"
        description="Indica i luoghi in cui si svolgerà l'intervento. Le localizzazioni sono utilizzate per strutturare i dati economici nelle fasi successive."
        caption="Puoi inserire fino a un massimo di 5 località."
      />

      <WizardSectionCard title="Localizzazioni progetto">
        {locations.map(loc => (
          <LocationCard
            key={loc.id}
            location={loc}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            canDelete={locations.length > 1 || !!loc.address}
          />
        ))}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className={`w-full border-2 border-dashed py-3 text-sm font-medium transition-colors
            ${canAdd
              ? 'border-gray-300 text-gray-600 hover:border-bluette-700 hover:text-bluette-700 cursor-pointer'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          style={{ borderRadius: 0 }}
        >
          Inserisci un altro luogo +
        </button>

        {locations.length >= 5 && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            Hai raggiunto il numero massimo di 5 località.
          </p>
        )}
      </WizardSectionCard>
    </div>
  )
}
