import { useLocation, useNavigate } from 'react-router-dom'

/* External URL placeholder for Scenari — replace with actual URL when available */
const SCENARI_URL = 'https://www.openeconomics.eu/insights-wall'

const products = [
  { id: 'scenari', label: 'Scenari', path: null, external: SCENARI_URL },
  { id: 'data-room', label: 'Data Room', path: '/data-room', external: null },
  { id: 'impatti', label: 'Impatti', path: '/impatti', external: null },
  { id: 'risorse', label: 'Risorse', path: '/risorse', external: null },
] as const

function getActiveProduct(pathname: string): string | null {
  if (pathname.startsWith('/impatti')) return 'impatti'
  if (pathname.startsWith('/data-room')) return 'data-room'
  if (pathname.startsWith('/risorse')) return 'risorse'
  return null
}

/* ProductSwitcher — global product navigation bar, always visible inside the app shell */
export function ProductSwitcher() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = getActiveProduct(pathname)

  return (
    <nav aria-label="Selezione prodotto" className="flex items-center gap-0.5">
      {products.map((p) => {
        const isActive = active === p.id
        return (
          <button
            key={p.id}
            onClick={() => {
              if (p.external) window.open(p.external, '_blank', 'noopener,noreferrer')
              else if (p.path) navigate(p.path)
            }}
            className={`px-3 py-1.5 text-sm transition-colors whitespace-nowrap border-b-2 ${
              isActive
                ? 'font-bold text-bluette-700 border-bluette-700'
                : 'font-medium text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {p.label}
            {p.external && (
              <span className="ml-0.5 text-xs opacity-50" aria-hidden="true">
                ↗
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
