import { useState } from "react";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { ValutazioniList } from "./components/ValutazioniList";
import { Wizard } from "./components/Wizard";
import { ProjectDetail } from "./components/ProjectDetail";
import { EiaKpiVerification } from "./components/EiaKpiVerification";
import { EiaRunning } from "./components/EiaRunning";
import { EiaResults } from "./components/EiaResults";

const VIEWS = {
  LOGIN: "login",
  LIST: "list",
  WIZARD: "wizard",
  PROJECT: "project",
  EIA_KPI: "eia_kpi",
  EIA_RUNNING: "eia_running",
  EIA_RESULTS: "eia_results",
};

export default function App() {
  const [view, setView] = useState(VIEWS.LOGIN);

  // Routing semplificato: cambia la view
  const go = (v) => setView(v);

  // Vista corrente
  let content = null;
  if (view === VIEWS.LOGIN) {
    content = <Login onLogin={() => go(VIEWS.LIST)} />;
  } else if (view === VIEWS.WIZARD) {
    content = (
      <Wizard
        onClose={() => go(VIEWS.LIST)}
        onComplete={() => go(VIEWS.PROJECT)}
      />
    );
  } else if (view === VIEWS.EIA_KPI) {
    content = (
      <EiaKpiVerification
        onClose={() => go(VIEWS.PROJECT)}
        onRun={() => go(VIEWS.EIA_RUNNING)}
      />
    );
  } else if (view === VIEWS.EIA_RUNNING) {
    content = (
      <EiaRunning
        onComplete={() => go(VIEWS.EIA_RESULTS)}
        onBackToProject={() => go(VIEWS.PROJECT)}
      />
    );
  } else {
    // Viste con layout
    content = (
      <Layout>
        {view === VIEWS.LIST && (
          <ValutazioniList
            onOpenProject={() => go(VIEWS.PROJECT)}
            onNewEvaluation={() => go(VIEWS.WIZARD)}
          />
        )}
        {view === VIEWS.PROJECT && (
          <ProjectDetail
            onBack={() => go(VIEWS.LIST)}
            onOpenEia={() => go(VIEWS.EIA_KPI)}
            onOpenEcba={() => alert("ECBA: fuori scope POC")}
            onOpenEsg={() => alert("ESG: fuori scope POC")}
          />
        )}
        {view === VIEWS.EIA_RESULTS && (
          <EiaResults onBack={() => go(VIEWS.PROJECT)} />
        )}
      </Layout>
    );
  }

  return (
    <>
      {content}
      <DevNav current={view} onGo={go} />
    </>
  );
}

// Barra di debug per saltare tra le viste senza completare i flussi.
// Da rimuovere prima della demo pubblica.
function DevNav({ current, onGo }) {
  const items = [
    { id: VIEWS.LOGIN, label: "Login" },
    { id: VIEWS.LIST, label: "Lista" },
    { id: VIEWS.WIZARD, label: "Wizard" },
    { id: VIEWS.PROJECT, label: "Dettaglio progetto" },
    { id: VIEWS.EIA_KPI, label: "Verifica KPI EIA" },
    { id: VIEWS.EIA_RUNNING, label: "Analisi in corso" },
    { id: VIEWS.EIA_RESULTS, label: "Risultati EIA" },
  ];
  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[100] bg-ink-900/90 backdrop-blur text-white rounded-full px-1.5 py-1 flex items-center gap-1 text-xs shadow-lg"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <span className="px-3 text-ink-300 hidden sm:inline">DEV</span>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onGo(it.id)}
          className={`px-3 py-1.5 rounded-full transition-colors ${
            current === it.id
              ? "bg-accent-lime text-ink-900"
              : "hover:bg-ink-700"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
