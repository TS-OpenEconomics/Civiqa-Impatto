import { useEffect, useMemo, useRef, useState } from "react";
import { useProjects } from "../../contexts/ProjectContext";
import { Badge } from "../ui/Badge";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChart,
  IconChevronDown,
  IconPin,
  IconSearch,
  IconTrash,
} from "../ui/Icons";
import { Skeleton, SkeletonText } from "../ui/Skeleton";

const ANALYSIS_ORDER = ["EIA", "ECBA", "ESG"];

const FEATURED = [
  {
    tag: "PROGETTI IN PARTENZA",
    nome: "Restauro Palazzo Reale",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA", "ESG"],
    body: (
      <>
        L&apos;intervento iniziera il <strong>15/09/2025</strong>. Assicurati che le attivita siano completate. Puoi
        monitorarne l&apos;andamento dal modulo PMO.
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
    body: <>Hai avviato solo alcune delle analisi disponibili. Completa le restanti per ottenere una valutazione completa del progetto.</>,
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
        Il progetto e stato aggiornato da <strong>Maria Concetta Rossi</strong> in data <strong>23/07/2025</strong>.
      </>
    ),
    settore: "Attivita di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
];

const LIST_PRESETS = [
  {
    nome: "Progetti per la formazione professionale 4.0",
    cup: "I63C22000050127",
    creato_il: "12/05/2025",
    proprietario: "Marco Bianchi",
    settore: "-",
    tipoIntervento: "-",
    inizioLavori: "-",
    durataLavori: "-",
    statoProgetto: "In Approvazione",
    bozza: true,
    analyses: [],
    action: "trash",
  },
  {
    nome: "Progetti per la sostenibilita ambientale",
    cup: "I63C22000050127",
    creato_il: "12/05/2025",
    proprietario: "Francesca Mori",
    settore: "Settore della moda e del design",
    tipoIntervento: "Formazione professionale",
    inizioLavori: "11/08/2025",
    durataLavori: "2 anni, 7 mesi",
    statoProgetto: "Approvato",
    action: "menu",
  },
  {
    nome: "Iniziativa di sviluppo sostenibile",
    cup: "I63C22000050127",
    creato_il: "12/05/2025",
    proprietario: "Luca Ferri",
    settore: "Energia e ambiente",
    tipoIntervento: "Riqualificazione",
    inizioLavori: "20/09/2025",
    durataLavori: "5 anni",
    statoProgetto: "Approvato",
    action: "menu",
  },
];





function AnalysisBadges({ active = [], className = "", sizeClass = "px-3 py-1 text-[13px] font-bold" }) {
  const activeSet = new Set(active);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {ANALYSIS_ORDER.map((analysis) => (
        <Badge key={analysis} type={analysis} dimmed={!activeSet.has(analysis)} className={sizeClass} />
      ))}
    </div>
  );
}

function FeaturedCard({ item, onOpen }) {
  return (
    <article data-featured-card="true" className="w-[470px] shrink-0 overflow-hidden bg-white shadow-[0_0_0_1px_rgba(14,14,16,0.08)]">
      <div className="flex h-10 items-end bg-[#2f2f2f]">
        <div className="bg-accent-lime px-4 py-2 text-[11px] font-bold uppercase leading-none text-ink-900">{item.tag}</div>
      </div>

      <div className="bg-[#2f2f2f] px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold text-white">{item.nome}</h3>
            <p className="mt-1 text-[11px] text-white/85">CUP {item.cup}</p>
          </div>
          <AnalysisBadges active={item.analisi || []} className="shrink-0 justify-end" sizeClass="px-2 py-0.5 text-[10px] font-bold" />
        </div>
      </div>

      <div className="grid min-h-[176px] grid-cols-[1.2fr_0.8fr] border-x border-ink-100 bg-white">
        <div className="px-4 py-4 text-[13px] leading-[1.45] text-ink-700">{item.body}</div>
        <div className="border-l border-ink-100 px-4 py-4 text-[12px] text-ink-700">
          <p className="mb-1 font-bold text-ink-900">Settore</p>
          <p className="leading-[1.45]">{item.settore}</p>
          <p className="mb-1 mt-4 font-bold text-ink-900">Durata lavori</p>
          <p>{item.durata}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="flex h-[48px] w-full items-center justify-between bg-brand-violet px-4 text-[14px] font-medium text-white transition-colors hover:bg-brand-violet-dark"
      >
        <span>Vai al dettaglio</span>
        <IconArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={`relative inline-flex h-[30px] w-[58px] items-center border border-[#d8d8d8] p-[3px] transition-colors ${
        checked ? "bg-brand-violet/15" : "bg-[#f2f2f2]"
      }`}
    >
      <span
        className={`block h-[22px] w-[22px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-transform ${
          checked ? "translate-x-[28px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ToolButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex h-[50px] items-center justify-center border border-[#dfdfdf] bg-[#f7f7f7] px-4 text-[16px] text-ink-900 transition-colors hover:bg-[#f0f0f0] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function ProjectAction({ action }) {
  if (action === "trash") {
    return <IconTrash className="h-7 w-7 text-[#d40000]" />;
  }

  return (
    <div className="flex items-center gap-1 text-brand-violet">
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
    </div>
  );
}

function ProjectListCard({ project, onOpen }) {
  return (
    <article className="overflow-hidden border border-[#e4e4e4] bg-white">
      <div className="grid border-b border-[#e6e6e6] lg:min-h-[96px] lg:grid-cols-[minmax(0,1fr)_370px_82px]">
        <div className="min-w-0 px-5 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-[19px] font-bold text-ink-900">{project.nome}</h3>
            {project.bozza ? (
              <span className="inline-flex h-[30px] items-center border border-brand-violet px-3 text-[14px] font-medium text-brand-violet">Bozza</span>
            ) : null}
          </div>
          <p className="mt-3 text-[15px] text-ink-500">
            CUP {project.cup} <span className="mx-2">-</span> Creato il {project.creato_il}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:border-l lg:border-[#e6e6e6]">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold text-ink-900">Analisi</span>
            <AnalysisBadges active={project.analyses || []} />
          </div>
          <ProjectAction action={project.action} />
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="flex h-[72px] items-center justify-center border-t border-[#e6e6e6] text-brand-violet transition-colors hover:bg-[#faf7ff] lg:h-auto lg:border-l lg:border-t-0"
          aria-label={`Apri ${project.nome}`}
        >
          <span className="text-[36px] leading-none">&rarr;</span>
        </button>
      </div>

      <div className="grid gap-x-8 gap-y-6 px-5 py-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoBlock label="Proprietario" value={project.proprietario} />
        <InfoBlock label="Settore" value={project.settore} />
        <InfoBlock label="Tipo intervento" value={project.tipoIntervento} />
        <InfoBlock label="Inizio lavori" value={project.inizioLavori} />
        <InfoBlock label="Durata lavori" value={project.durataLavori} />
        <InfoBlock label="Stato del progetto" value={project.statoProgetto} />
      </div>
    </article>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-[14px] font-bold text-ink-900">{label}</p>
      <p className="mt-2 text-[15px] leading-[1.35] text-ink-900">{value}</p>
    </div>
  );
}

function buildDisplayProject(workspace, index) {
  const preset = LIST_PRESETS[index] || {};

  let availableAnalyses;
  if (preset.analyses) {
    availableAnalyses = ANALYSIS_ORDER.filter((a) => preset.analyses.includes(a));
  } else {
    const ws = workspace.analyses || {};
    const eiaActive  = ws.eia?.status  && ws.eia.status  !== "needs_input";
    const ecbaActive = ws.ecba?.status && ws.ecba.status !== "needs_input";
    // EIA and ECBA always together — either both or neither
    const showEiaEcba = eiaActive && ecbaActive;
    // ESG only when all three analyses are fully completed
    const showEsg = ws.esg?.status === "completed" && ws.eia?.status === "completed" && ws.ecba?.status === "completed";
    availableAnalyses = [
      ...(showEiaEcba ? ["EIA", "ECBA"] : []),
      ...(showEsg     ? ["ESG"]          : []),
    ];
  }

  return {
    id: workspace.id,
    nome: preset.nome || workspace.project.nome,
    cup: preset.cup || workspace.project.cup,
    creato_il: preset.creato_il || workspace.project.creato_il || "-",
    proprietario: preset.proprietario || workspace.project.creato_da?.split(",")[1]?.trim() || "Mario Rossi",
    settore: preset.settore || workspace.project.configurazione.settore || "-",
    tipoIntervento: preset.tipoIntervento || workspace.project.configurazione.tipo_intervento || "-",
    inizioLavori: preset.inizioLavori || workspace.project.ultima_modifica || "-",
    durataLavori: preset.durataLavori || workspace.project.configurazione.durata_progetto || "-",
    statoProgetto: preset.statoProgetto || workspace.project.stato || "-",
    bozza: preset.bozza || workspace.project.stato === "Bozza",
    analyses: availableAnalyses,
    action: preset.action || "menu",
  };
}

export function ValutazioniList({ onOpenProject, onNewEvaluation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);
  const [showWithoutAnalysisOnly, setShowWithoutAnalysisOnly] = useState(false);
  const featuredRef = useRef(null);
  const {
    projects,
    uiState,
    setSearchTerm,
    setDebouncedSearchTerm,
    setSortMode,
  } = useProjects();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const displayProjects = useMemo(() => projects.map((workspace, index) => buildDisplayProject(workspace, index)), [projects]);

  const filteredProjects = useMemo(() => {
    const term = uiState.debouncedSearchTerm;
    let list = displayProjects.filter((project) => {
      if (!term) return true;
      return `${project.nome} ${project.cup} ${project.proprietario} ${project.settore}`.toLowerCase().includes(term);
    });

    if (showDraftsOnly) {
      list = list.filter((project) => project.bozza);
    }

    if (showWithoutAnalysisOnly) {
      list = list.filter((project) => !project.analyses?.length);
    }

    if (uiState.sortMode === "az") {
      list = [...list].sort((a, b) => a.nome.localeCompare(b.nome, "it"));
    }

    return list;
  }, [displayProjects, showDraftsOnly, showWithoutAnalysisOnly, uiState.debouncedSearchTerm, uiState.sortMode]);

  function scrollFeatured(direction) {
    const container = featuredRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll("[data-featured-card='true']"));
    if (!cards.length) return;
    const step = cards[0].clientWidth + 16;
    container.scrollBy({ left: direction === "next" ? step : -step, behavior: "smooth" });
  }

  function handleInlineSearch(value) {
    setSearchTerm(value);
    setDebouncedSearchTerm(value.trim().toLowerCase());
  }

  return (
    <div className="bg-[#f5f5f5]">
      <section className="px-6 pb-6 pt-7 xl:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <IconChart className="h-7 w-7 text-ink-900" />
              <h1 className="text-[22px] font-bold leading-none text-ink-900">Valutazione</h1>
            </div>
            <p className="mt-4 max-w-[900px] text-[14px] leading-[1.5] text-ink-900">
              All&apos;interno di questa sezione potrai configurare i tuoi progetti e consultare le valutazioni gia elaborate. Creando una nuova valutazione ti verra chiesto di definire un progetto, sul quale potrai eseguire analisi di impatto, analisi costi-benefici e analisi ESG.{" "}
              <a href="#" className="text-brand-violet underline">
                Approfondisci ulteriormente
              </a>
            </p>
          </div>

          <button
            type="button"
            onClick={onNewEvaluation}
            className="flex h-[61px] w-full items-center justify-between bg-brand-violet px-5 text-[15px] font-medium text-white transition-colors hover:bg-brand-violet-dark xl:mt-8 xl:w-[358px]"
          >
            <span>Nuova valutazione</span>
            <span className="text-[28px] leading-none">+</span>
          </button>
        </div>

        <h2 className="mt-9 text-[18px] font-bold text-ink-900">In evidenza</h2>

        {isLoading ? (
          <div className="mt-5 flex gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-[470px] shrink-0 bg-white p-5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-4 h-6 w-56" />
                <SkeletonText lines={3} className="mt-5" />
                <Skeleton className="mt-6 h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mt-5 overflow-hidden px-0 pb-12 pt-0">
            <div ref={featuredRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FEATURED.map((item, index) => (
                <FeaturedCard key={item.tag} item={item} onOpen={() => projects[index] && onOpenProject(projects[index].id)} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollFeatured("prev")}
              className="absolute bottom-5 left-5 z-10 flex h-[40px] w-[40px] items-center justify-center bg-[#5b5b5b] text-white"
              aria-label="Scorri indietro"
            >
              <IconArrowLeft className="h-4 w-4" />
            </button>

            <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-[11px] font-semibold text-ink-900">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-ink-900 text-[10px]">i</span>
              <span>Usa le frecce per navigare i contenuti</span>
            </div>

            <button
              type="button"
              onClick={() => scrollFeatured("next")}
              className="absolute bottom-5 right-5 z-10 flex h-[40px] w-[40px] items-center justify-center bg-[#5b5b5b] text-white"
              aria-label="Scorri avanti"
            >
              <IconArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      <section className="px-6 pb-10 xl:px-8">
        <div className="border border-[#e6e6e6] bg-white px-5 py-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-[16px] text-ink-900">
            <span>Visualizza solo:</span>
            <label className="flex items-center gap-3">
              <span>Valutazioni in bozza</span>
              <Toggle checked={showDraftsOnly} onChange={() => setShowDraftsOnly((prev) => !prev)} />
            </label>
            <label className="flex items-center gap-3">
              <span>Valutazioni senza analisi</span>
              <Toggle checked={showWithoutAnalysisOnly} onChange={() => setShowWithoutAnalysisOnly((prev) => !prev)} />
            </label>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-4">
              <span className="text-[16px] text-ink-900">Cerca per province e comuni:</span>
              <ToolButton className="w-[52px] px-0">
                <IconPin className="h-5 w-5 text-ink-900" />
              </ToolButton>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[16px] text-ink-900">Filtra per:</span>
              <ToolButton className="w-[52px] px-0">
                <svg className="h-5 w-5 text-ink-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16" />
                  <path d="M7 12h10" />
                  <path d="M10 18h4" />
                </svg>
              </ToolButton>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[16px] text-ink-900">Ordina per:</span>
              <ToolButton
                onClick={() => setSortMode(uiState.sortMode === "az" ? "recent" : "az")}
                className="min-w-[154px] justify-between bg-[#f6f6f6] px-3"
              >
                <span>{uiState.sortMode === "az" ? "A-Z" : "piu recenti"}</span>
                <IconChevronDown className="h-4 w-4 text-brand-violet" />
              </ToolButton>
            </div>

            <div className="ml-auto w-full max-w-[342px]">
              <div className="relative">
                <input
                  type="text"
                  value={uiState.searchTerm}
                  onChange={(event) => handleInlineSearch(event.target.value)}
                  placeholder="Cerca tra i progetti"
                  className="h-[50px] w-full border border-ink-300 pl-5 pr-14 text-[16px] placeholder:text-ink-400 focus:border-brand-violet focus:outline-none"
                />
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ink-900">
                  <IconSearch className="h-6 w-6" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[220px]" />)
          ) : filteredProjects.length === 0 ? (
            <div className="border border-[#e4e4e4] bg-white px-5 py-12 text-center text-[15px] text-ink-500">
              Nessuna valutazione trovata.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectListCard key={project.id} project={project} onOpen={() => onOpenProject(project.id)} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
