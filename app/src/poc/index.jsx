/* Barrel for the ported Civiqa_POC sections.
 * - imports the re-skin theme (maps the POC Design System onto app/'s identity)
 * - re-exports the pages mounted by app/src/router.jsx
 * - provides PocPage: the `.poc-scope` wrapper that confines the POC resets/tokens
 * - provides GeniePlaceholder: keyless stand-in for the AI Genie space
 */
import "./poc-theme.css";

export { AppShell } from "./components/layout/AppShell";
export { HomeLauncher } from "./pages/HomeLauncher";
export { ImpattDashboard } from "./pages/ImpattDashboard";
export { DocfapList } from "./pages/DocfapList";
export { DocfapDetail } from "./pages/DocfapDetail";
export { DocfapMcaDetail } from "./pages/DocfapMcaDetail";
export { PianificazioneModule } from "./components/pianificazione/PianificazioneModule";
export { DataRoomPage } from "./pages/DataRoomPage";
export { RisorsePage } from "./pages/RisorsePage";
export { ComposingPlaceholder } from "./modules/Placeholders";

/* Scope wrapper — every POC route renders inside this so the POC global
 * resets (border-radius:0, grey surface) and violet/lime token overrides
 * stay confined to POC content and never touch app/'s own pages or chrome. */
export function PocPage({ children }) {
  return <div className="poc-scope">{children}</div>;
}

/* Keyless Genie placeholder (no Anthropic/Databricks calls). */
export function GeniePlaceholder() {
  return (
    <div className="poc-scope">
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-2xl border border-gray-200 bg-white p-10 text-center" style={{ boxShadow: "0px 4px 4px rgba(0,0,0,0.15)" }}>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-bluette-50 text-bluette-700">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-gray-900">Genie</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            L'assistente AI Genie sarà disponibile nella versione completa. In questa
            demo l'analisi conversazionale è disattivata (nessuna chiave API richiesta).
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Le funzionalità di valutazione d'impatto restano pienamente operative dal menu
            <strong className="text-bluette-700"> Valutazione</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
