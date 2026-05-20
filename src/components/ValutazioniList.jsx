import { useEffect, useMemo, useRef, useState } from "react";
import { useProjects } from "../contexts/ProjectContext";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { Skeleton, SkeletonText } from "./ui/Skeleton";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "./ui/Icons";

const FEATURED = [
  {
    tag: "PROGETTI IN PARTENZA",
    nome: "Restauro Palazzo Reale",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA", "ESG"],
    body: (
      <>
        L'intervento iniziera il <span className="font-mono font-semibold">15/09/2025</span>.
        Assicurati che le attivita siano completate. Puoi monitorarne l'andamento dal
        modulo <strong>PMO</strong>.
      </>
    ),
    settore: "Attivita di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
  {
    tag: "PROGETTI DA COMPLETARE",
    nome: "Progetti per la sostenibilita ambientale",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA"],
    analisiDisabled: ["ESG"],
    body: (
      <>
        Hai avviato solo alcune delle analisi disponibili. Completa le restanti per
        ottenere una valutazione completa del progetto.
      </>
    ),
    settore: "Attivita di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
  {
    tag: "ULTIMI AGGIORNAMENTI",
    nome: "Progetti per la sostenibilita ambientale",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA", "ESG"],
    body: (
      <>
        Il progetto e stato aggiornato da <strong>Maria Concetta Rossi</strong> in data{" "}
        <span className="font-mono font-semibold">23/07/2025</span>.
      </>
    ),
    settore: "Attivita di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
];

export function ValutazioniList({ onOpenProject, onNewEvaluation }) {
  const [tab, setTab] = useState("dipartimento");
  const [isLoading, setIsLoading] = useState(true);
  const featuredRef = useRef(null);
  const { projects, uiState, toggleSectorFilter, setSortMode } = useProjects();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const sectorOptions = useMemo(
    () => [...new Set(projects.map((workspace) => workspace.project.configurazione.settore))],
    [projects],
  );

  const normalizedProjects = useMemo(
    () =>
      projects.map((workspace, index) => ({
        id: workspace.id,
        nome: workspace.project.nome,
        cup: workspace.project.cup,
        settore: workspace.project.configurazione.settore,
        analisi: ["EIA", "ECBA", "ESG"],
        stato: workspace.project.stato,
        aggiornato: workspace.project.ultima_modifica,
        avanzamento: analysisProgress(workspace.analyses),
        primary: index === 0,
      })),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const term = uiState.debouncedSearchTerm;
    const bySearch = normalizedProjects.filter((project) => {
      if (!term) return true;
      const haystack = `${project.nome} ${project.cup} ${project.settore}`.toLowerCase();
      return haystack.includes(term);
    });

    const bySector = uiState.sectorFilters.length
      ? bySearch.filter((project) => uiState.sectorFilters.includes(project.settore))
      : bySearch;

    return [...bySector].sort((left, right) => {
      if (uiState.sortMode === "az") {
        return left.nome.localeCompare(right.nome);
      }
      if (uiState.sortMode === "status") {
        return left.stato.localeCompare(right.stato);
      }
      return parseItalianDate(right.aggiornato) - parseItalianDate(left.aggiornato);
    });
  }, [normalizedProjects, uiState.debouncedSearchTerm, uiState.sectorFilters, uiState.sortMode]);

  function scrollFeatured(direction) {
    const container = featuredRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll("[data-featured-card='true']"));
    if (!cards.length) return;

    const currentLeft = container.scrollLeft;
    const tolerance = 24;
    const cardPositions = cards.map((card) => card.offsetLeft);

    if (direction === "next") {
      const nextLeft = cardPositions.find((left) => left > currentLeft + tolerance);
      container.scrollTo({
        left: nextLeft ?? cardPositions[cardPositions.length - 1],
        behavior: "smooth",
      });
      return;
    }

    const previous = [...cardPositions].reverse().find((left) => left < currentLeft - tolerance);
    container.scrollTo({
      left: previous ?? 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="flex flex-col items-start justify-between gap-8 xl:flex-row">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-brand-violet-soft text-brand-violet flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3z" />
              </svg>
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Valutazione</h1>
          </div>
          <p className="mt-5 text-sm text-ink-700 leading-relaxed">
            All'interno di questa sezione potrai configurare i tuoi progetti e consultare
            le valutazioni gia elaborate. Creando una nuova valutazione ti verra chiesto
            di definire un progetto, sul quale potrai eseguire analisi di impatto, analisi
            costi-benefici e analisi ESG.{" "}
            <a href="#" className="text-brand-violet underline">
              Approfondisci ulteriormente
            </a>
          </p>
        </div>
        <button
          onClick={onNewEvaluation}
          className="h-12 px-6 bg-brand-violet text-white text-sm font-semibold flex items-center gap-3 hover:bg-brand-violet-dark"
        >
          <span>Nuova valutazione</span>
          <span className="text-xl leading-none">+</span>
        </button>
      </div>

      <h2 className="mt-10 text-base font-bold">In evidenza</h2>

      {isLoading ? (
        <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-5">
              <Skeleton className="h-6 w-40" />
              <SkeletonText lines={3} className="mt-5" />
              <Skeleton className="mt-6 h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 relative">
            <button
              type="button"
              onClick={() => scrollFeatured("prev")}
              className="absolute left-0 top-1/2 z-10 -ml-2 flex h-16 w-10 -translate-y-1/2 items-center justify-center bg-ink-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.24)]"
            >
              <IconChevronLeft />
            </button>

            <div
              ref={featuredRef}
              className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="min-w-max flex gap-5 px-10 py-1">
                {FEATURED.map((card, i) => (
                  <FeaturedCard key={i} {...card} onOpen={() => onOpenProject(normalizedProjects[0]?.id)} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollFeatured("next")}
              className="absolute right-0 top-1/2 z-10 -mr-2 flex h-16 w-10 -translate-y-1/2 items-center justify-center bg-ink-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.24)]"
            >
              <IconChevronRight />
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-ink-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-300 text-[10px] text-white">i</span>
            Usa le frecce per navigare i contenuti
          </p>
        </>
      )}

      <div className="mt-10 border-b border-ink-100 flex gap-10 justify-center">
        <TabButton active={tab === "dipartimento"} onClick={() => setTab("dipartimento")}>
          Valutazioni del tuo dipartimento
        </TabButton>
        <TabButton active={tab === "province"} onClick={() => setTab("province")}>
          Valutazioni delle province e dei comuni
        </TabButton>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-6 text-sm">
        <span className="font-medium">Visualizza solo:</span>
        {sectorOptions.map((sector) => (
          <Checkbox
            key={sector}
            label={sector}
            checked={uiState.sectorFilters.includes(sector)}
            onChange={() => toggleSectorFilter(sector)}
          />
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="font-medium">Ordina per</span>
          <select
            value={uiState.sortMode}
            onChange={(event) => setSortMode(event.target.value)}
            className="h-10 border border-ink-100 bg-white px-3 text-sm"
          >
            <option value="recent">Piu recente</option>
            <option value="az">A-Z</option>
            <option value="status">Stato analisi</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto bg-white">
        <table className="min-w-[920px] w-full text-sm">
          <thead className="bg-ink-900 text-white text-left">
            <tr>
              <th className="px-5 py-3 font-semibold">Progetto</th>
              <th className="px-5 py-3 font-semibold">CUP</th>
              <th className="px-5 py-3 font-semibold">Settore</th>
              <th className="px-5 py-3 font-semibold">Analisi</th>
              <th className="px-5 py-3 font-semibold">Stato</th>
              <th className="px-5 py-3 font-semibold">Avanzamento</th>
              <th className="px-5 py-3 font-semibold">Aggiornato il</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b border-ink-100">
                    {Array.from({ length: 8 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-5 py-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : filteredProjects.map((project, i) => (
              <tr key={i} className="border-b border-ink-100 hover:bg-bg-page">
                <td className="px-5 py-4 font-medium">{project.nome}</td>
                <td className="px-5 py-4 font-mono text-xs">{project.cup}</td>
                <td className="px-5 py-4 text-ink-700">{project.settore}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    {project.analisi.map((analysis) => (
                      <Badge key={analysis} type={analysis} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatoChip stato={project.stato} />
                </td>
                <td className="px-5 py-4 text-xs text-ink-700">{project.avanzamento}</td>
                <td className="px-5 py-4 font-mono text-xs">{project.aggiornato}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="font-semibold flex items-center gap-1 text-brand-violet"
                  >
                    Apri <IconArrowRight />
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-5 py-10">
                  <EmptyState
                    compact
                    eyebrow="Valutazioni"
                    title={projects.length === 0 ? "Nessuna valutazione disponibile" : "Nessun progetto corrisponde ai filtri"}
                    description={
                      projects.length === 0
                        ? "La lista è vuota. Puoi creare subito la prima valutazione e iniziare a configurare un progetto."
                        : "Prova a rimuovere alcuni filtri o ad ampliare la ricerca per visualizzare altri progetti."
                    }
                    actionLabel={projects.length === 0 ? "Crea la tua prima valutazione" : "Nuova valutazione"}
                    onAction={onNewEvaluation}
                  />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeaturedCard({ tag, nome, cup, analisi, analisiDisabled, body, settore, durata, onOpen }) {
  return (
    <article
      data-featured-card="true"
      className="min-w-[440px] max-w-[440px] snap-start overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.1)]"
    >
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,_#1B132C_0%,_#31204F_58%,_#51358C_100%)] px-5 pb-6 pt-5 text-white">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex bg-accent-lime px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-ink-900">
            {tag}
          </span>
          <div className="flex flex-wrap justify-end gap-1">
            {analisi.map((analysis) => (
              <Badge key={analysis} type={analysis} />
            ))}
            {analisiDisabled?.map((analysis) => (
              <Badge key={analysis} type={analysis} dimmed />
            ))}
          </div>
        </div>

        <h3 className="relative mt-5 max-w-[26rem] text-xl font-bold leading-tight">{nome}</h3>
        <p className="relative mt-2 text-xs font-mono uppercase tracking-[0.14em] text-ink-300">CUP {cup}</p>
      </div>

      <div className="grid gap-5 px-5 py-5 text-sm text-ink-900">
        <div className="rounded-2xl border border-ink-100 bg-bg-page px-4 py-4 leading-relaxed">{body}</div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-ink-100 px-4 py-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">Settore</p>
            <p className="mt-2 leading-relaxed text-ink-800">{settore}</p>
          </div>
          <div className="rounded-2xl border border-ink-100 px-4 py-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">Durata lavori</p>
            <p className="mt-2 text-base font-semibold text-ink-900">{durata}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-l-4 border-brand-violet bg-brand-violet-soft px-4 py-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">Lettura rapida</p>
            <p className="mt-1 font-semibold text-ink-900">{analisiDisabled?.length ? "Analisi da completare" : "Pronto per la consultazione"}</p>
          </div>
          <div className="rounded-2xl bg-ink-50 px-4 py-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">Analisi disponibili</p>
            <p className="mt-1 font-semibold text-ink-900">
              {analisi.length + (analisiDisabled?.length ?? 0)} moduli
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="flex h-14 w-full items-center justify-between bg-brand-violet px-5 text-sm font-semibold text-white hover:bg-brand-violet-dark"
      >
        <span>Vai al dettaglio</span>
        <IconArrowRight className="w-5 h-5" />
      </button>
    </article>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 text-sm font-semibold transition-colors relative ${
        active ? "text-brand-violet" : "text-ink-500"
      }`}
    >
      {children}
      {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-violet" />}
    </button>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-brand-violet" />
      <span>{label}</span>
    </label>
  );
}

function StatoChip({ stato }) {
  const map = {
    Approvato: "bg-emerald-100 text-emerald-700",
    "In valutazione": "bg-amber-100 text-amber-700",
    Bozza: "bg-ink-100 text-ink-700",
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold ${map[stato] || ""}`}>{stato}</span>
  );
}

function analysisProgress(analyses) {
  if (!analyses) return "0/3 analisi";
  const completed = Object.values(analyses).filter((item) => item.status === "completed").length;
  const running = Object.values(analyses).filter((item) => item.status === "running").length;
  return running > 0 ? `${completed}/3 completate, ${running} in corso` : `${completed}/3 completate`;
}

function parseItalianDate(value) {
  const [day = "01", month = "01", year = "1970"] = String(value).split("/");
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}
