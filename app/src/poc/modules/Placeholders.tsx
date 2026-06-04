/* Placeholder screens for modules not yet active in the POC */

function PlaceholderPage({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="text-center max-w-lg px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
          {icon}
        </div>
        <h1 className="font-serif text-3xl font-bold text-bluette-900 mb-3">{title}</h1>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-sm font-medium px-4 py-2 rounded-lg">
          <span className="w-2 h-2 bg-amber-400 rounded-full" />
          Modulo in sviluppo
        </div>
      </div>
    </div>
  )
}

export function DashboardPlaceholder() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Panoramica dell'ente, indicatori chiave e attività recenti."
      icon="📊"
    />
  )
}

export function DataRoomPlaceholder() {
  return (
    <PlaceholderPage
      title="Data Room"
      description="Dati territoriali, categorie e indicatori del tuo comune. Confronto con cluster di comuni simili."
      icon="🗂️"
    />
  )
}

export function ValutazionePlaceholder() {
  return (
    <PlaceholderPage
      title="Valutazione"
      description="Crea un progetto ed esegui analisi CBA, EIA e ESG tramite i motori OpenCore."
      icon="⚖️"
    />
  )
}

export function ComposingPlaceholder() {
  return (
    <PlaceholderPage
      title="Composing"
      description="Aggrega, confronta e combina analisi già svolte. Storie e ranking di progetti."
      icon="🔗"
    />
  )
}

export function PianificazionePlaceholder() {
  /* Questo verrà sostituito dal modulo reale nello Step 4 */
  return (
    <PlaceholderPage
      title="Pianificazione"
      description="Identifica fabbisogni, esplora alternative e costruisci il piano opere del tuo ente."
      icon="🎯"
    />
  )
}