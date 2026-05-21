import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectContext";
import { useToast } from "../hooks/useToast.jsx";
import { Modal } from "./ui/Modal";
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

const SIDEBAR_STORAGE_KEY = "civiqa.sidebar.collapsed";

export function Layout({ children }) {
  const { uiState, setSearchTerm, setDebouncedSearchTerm } = useProjects();
  const [searchDraft, setSearchDraft] = useState(uiState.searchTerm);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  });
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchTerm(searchDraft);
      setDebouncedSearchTerm(searchDraft.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(handle);
  }, [searchDraft, setDebouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 1099px)");
    const syncCollapse = (event) => setIsCollapsed(event.matches);

    syncCollapse(media);
    media.addEventListener("change", syncCollapse);
    return () => media.removeEventListener("change", syncCollapse);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header
        searchDraft={searchDraft}
        setSearchDraft={setSearchDraft}
        onHelp={() => setIsHelpOpen(true)}
        onNotificationsToggle={() => setIsBellOpen((prev) => !prev)}
        isBellOpen={isBellOpen}
        onUserMenuToggle={() => setIsUserMenuOpen((prev) => !prev)}
        isUserMenuOpen={isUserMenuOpen}
        onSettings={() =>
          toast({
            title: "Impostazioni in arrivo",
            description: "Questa area verra completata nelle prossime iterazioni.",
          })
        }
        onLogout={() => logout()}
        user={user}
      />
      <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} />
        <main className="min-w-0 flex-1 bg-bg-page">{children}</main>
      </div>
      {isHelpOpen ? (
        <Modal title="Centro assistenza" onClose={() => setIsHelpOpen(false)}>
          <p className="text-sm leading-relaxed text-ink-700">
            Documentazione in arrivo. Nella demo puoi usare il login preconfigurato e completare l'intero flusso di valutazione.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function Header({
  searchDraft,
  setSearchDraft,
  onHelp,
  onNotificationsToggle,
  isBellOpen,
  onUserMenuToggle,
  isUserMenuOpen,
  onSettings,
  onLogout,
  user,
}) {
  const navigate = useNavigate();
  const notifications = useMemo(
    () => [
      "Analisi EIA completata per Intervento efficientamento servizio idrico",
      "Nuova valutazione duplicata con successo",
      "Questionario ESG pronto per la compilazione",
    ],
    [],
  );

  return (
    <header className="relative">
      <div className="flex h-auto flex-wrap items-center gap-4 border-b border-ink-100 bg-white px-4 py-3 md:h-16 md:flex-nowrap md:px-6 md:py-0 md:gap-6">
        <div className="flex shrink-0 items-center gap-2 md:w-64">
          <IconLogo className="w-4 h-4" />
          <span className="text-[30px] md:text-[24px] font-bold tracking-tight leading-none">
            Civiqa
          </span>
        </div>

        <div className="order-3 w-full md:order-none md:flex-1 md:max-w-[820px]">
          <div className="relative">
            <input
              type="text"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Cerca documenti, progetti, pianificazioni..."
              className="w-full h-[48px] rounded-none border border-ink-300 pl-5 pr-12 bg-white text-[14px] placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
            />
            <button
              type="button"
              onClick={() => navigate("/valutazioni")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-ink-700"
            >
              <IconSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-5">
          <button type="button" onClick={onHelp} className="text-ink-700 hover:text-ink-900" aria-label="Aiuto">
            <IconHelp className="w-5 h-5" />
          </button>
          <div className="relative">
            <button type="button" onClick={onNotificationsToggle} className="text-ink-700 hover:text-ink-900" aria-label="Notifiche">
              <IconBell className="w-5 h-5" />
            </button>
            {isBellOpen ? (
              <div className="absolute right-0 top-10 z-20 w-80 border border-ink-100 bg-white shadow-xl">
                <div className="border-b border-ink-100 px-4 py-3 text-sm font-semibold">Notifiche</div>
                <div className="divide-y divide-ink-100">
                  {notifications.map((item) => (
                    <div key={item} className="px-4 py-3 text-sm text-ink-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <button type="button" onClick={onSettings} className="text-ink-700 hover:text-ink-900" aria-label="Impostazioni">
            <IconSettings className="w-5 h-5" />
          </button>
          <div className="relative">
            <button type="button" onClick={onUserMenuToggle} className="ml-4 flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-brand-violet text-white flex items-center justify-center text-xs font-semibold">
                {user?.initials || "MR"}
              </span>
              <span className="hidden text-[14px] font-medium sm:inline">{user?.name || "Mario Rossi"}</span>
              <IconChevronDown className="w-4 h-4" />
            </button>
            {isUserMenuOpen ? (
              <div className="absolute right-0 top-12 z-20 w-64 border border-ink-100 bg-white shadow-xl">
                <div className="border-b border-ink-100 px-4 py-3">
                  <p className="text-sm font-semibold">{user?.name || "Mario Rossi"}</p>
                  <p className="mt-1 text-xs text-ink-500">{user?.role || "Analista"}</p>
                </div>
                <button type="button" className="block w-full px-4 py-3 text-left text-sm hover:bg-bg-page">
                  Profilo
                </button>
                <button type="button" onClick={onLogout} className="block w-full px-4 py-3 text-left text-sm font-semibold text-brand-violet hover:bg-bg-page">
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="h-[3px] bg-accent-lime" />
    </header>
  );
}

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`${isCollapsed ? "w-16" : "w-[228px]"} shrink-0 border-r border-ink-100 bg-white flex flex-col transition-all`}>
      <nav className="flex flex-col border-t border-ink-100">
        <SidebarItem
          icon={<IconDashboard className="w-5 h-5" />}
          label="Dashboard"
          to="/valutazioni"
          collapsed={isCollapsed}
        />
        <SidebarItem
          icon={<IconCompass className="w-5 h-5" />}
          label="Osservatorio strategico"
          collapsed={isCollapsed}
          disabled
        />
      </nav>

      <div className={`${isCollapsed ? "px-2" : "px-4"} py-5 border-t border-ink-100`}>
        <p className="text-[11px] uppercase tracking-tight text-ink-500">Valutazioni</p>
      </div>

      <nav className="flex flex-col">
        <SidebarItem
          icon={<IconChart className="w-5 h-5" />}
          label="Valutazione"
          to="/valutazioni"
          collapsed={isCollapsed}
          emphasize
        />
      </nav>

      <div className="mt-auto px-4 pb-5">
        <button
          type="button"
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center text-ink-700 hover:text-ink-900 border border-ink-300"
          aria-label="Comprimi sidebar"
        >
          <IconCollapse />
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, to, collapsed, disabled = false, emphasize = false }) {
  if (disabled) {
    return (
      <button
        type="button"
        title="In arrivo nella versione completa"
        className="flex items-center gap-3 text-left cursor-not-allowed px-4 py-4 text-[12px] font-medium text-ink-900 border-b border-ink-100"
      >
        <span className="text-ink-900">{icon}</span>
        {!collapsed ? <span>{label}</span> : null}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 text-left transition-colors ${
          collapsed ? "justify-center px-2 py-4" : "px-4 py-4"
        } ${
          isActive
            ? `${emphasize ? "bg-[#e7ddff] text-brand-violet border-l-[6px] border-brand-violet" : "text-ink-900"}`
            : "text-ink-900 hover:bg-ink-100/40"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? "text-brand-violet" : "text-ink-700"}>{icon}</span>
          {!collapsed ? <span className="text-[13px]">{label}</span> : null}
        </>
      )}
    </NavLink>
  );
}
