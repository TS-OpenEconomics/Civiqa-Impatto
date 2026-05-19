import {
  IconSearch,
  IconHelp,
  IconBell,
  IconSettings,
  IconChevronDown,
  IconDashboard,
  IconCompass,
  IconChart,
  IconLogo,
  IconCollapse,
} from "./ui/Icons";

export function Layout({ children, activeNav = "valutazione" }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
        <Sidebar activeNav={activeNav} />
        <main className="flex-1 bg-bg-page">{children}</main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="relative">
      <div className="h-16 bg-white flex items-center px-6 gap-6 border-b border-ink-100">
        {/* Logo */}
        <div className="flex items-center gap-2 w-56 shrink-0">
          <IconLogo className="w-4 h-4" />
          <span className="font-bold tracking-tight text-lg">Externalytics</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca documenti, progetti, pianificazioni..."
              className="w-full h-11 pl-5 pr-12 rounded-md border border-ink-100 bg-white text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700">
              <IconSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button className="text-ink-700 hover:text-ink-900" aria-label="Aiuto">
            <IconHelp className="w-5 h-5" />
          </button>
          <button className="text-ink-700 hover:text-ink-900" aria-label="Notifiche">
            <IconBell className="w-5 h-5" />
          </button>
          <button className="text-ink-700 hover:text-ink-900" aria-label="Impostazioni">
            <IconSettings className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 ml-2">
            <span className="w-9 h-9 rounded-full bg-brand-violet text-white flex items-center justify-center text-xs font-semibold">
              MR
            </span>
            <span className="text-sm font-medium">Mario Rossi</span>
            <IconChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Filetto verde lime - signature del brand */}
      <div className="h-[3px] bg-accent-lime" />
    </header>
  );
}

function Sidebar({ activeNav }) {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-ink-100 py-6 flex flex-col">
      <nav className="px-3 flex flex-col gap-1">
        <SidebarItem
          icon={<IconDashboard />}
          label="Dashboard"
          active={activeNav === "dashboard"}
        />
        <SidebarItem
          icon={<IconCompass />}
          label="Osservatorio strategico"
          active={activeNav === "osservatorio"}
        />
      </nav>

      <div className="mt-6 px-6">
        <p className="text-xs font-semibold text-ink-300 tracking-widest uppercase">
          Valutazioni
        </p>
      </div>
      <nav className="mt-2 px-3 flex flex-col gap-1">
        <SidebarItem
          icon={<IconChart />}
          label="Valutazione"
          active={activeNav === "valutazione"}
        />
      </nav>

      <div className="mt-auto px-3 pb-2">
        <button className="w-9 h-9 flex items-center justify-center text-ink-700 hover:text-ink-900" aria-label="Comprimi sidebar">
          <IconCollapse />
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <button
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left transition-colors ${
        active
          ? "bg-brand-violet-soft text-brand-violet"
          : "text-ink-900 hover:bg-ink-100/40"
      }`}
    >
      <span className={active ? "text-brand-violet" : "text-ink-700"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
