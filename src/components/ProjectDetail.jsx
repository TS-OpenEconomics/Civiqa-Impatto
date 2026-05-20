import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectContext";
import { useToast } from "../hooks/useToast.jsx";
import projectData from "../mocks/project.json";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { IconArrowRight, IconChevronDown, IconDownload, IconFile, IconGrid, IconList, IconTrash, IconUpload } from "./ui/Icons";
import { Modal } from "./ui/Modal";
import { Skeleton, SkeletonText } from "./ui/Skeleton";

function formatCurrency(num) {
  return `${new Intl.NumberFormat("it-IT").format(num)} EUR`;
}

export function ProjectDetail({
  workspaceId,
  project = projectData,
  analyses,
  results,
  onBack,
  onOpenEia,
  onOpenEcba,
  onOpenEsg,
}) {
  const navigate = useNavigate();
  const { clearAnalysisData, duplicateProject, deleteProject, setDraftProject } = useProjects();
  const { user } = useAuth();
  const { toast } = useToast();
  const [modal, setModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const p = project;
  const analysisState = analyses || {
    eia: { status: "needs_input" },
    ecba: { status: "needs_input" },
    esg: { status: "needs_input" },
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 py-8 md:px-10">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-5 h-10 w-80" />
        <SkeletonText lines={3} className="mt-4 max-w-4xl" />
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="mt-8 space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-10">
      <nav className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="underline text-ink-900">
          Valutazione
        </button>
        <span className="text-ink-300">/</span>
        <span className="font-semibold">Dettaglio del progetto</span>
      </nav>

      <p className="mt-4 text-xs text-ink-700">
        Creato il <span className="font-mono font-semibold">{p.creato_il}</span> da{" "}
        <strong>{p.creato_da}</strong> - Ultima modifica il{" "}
        <span className="font-mono font-semibold">{p.ultima_modifica}</span>
      </p>

      <div className="mt-4 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,_#0F172A_0%,_#1E1B4B_52%,_#4C1D95_100%)] px-6 py-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)] md:px-8 md:py-8">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-white/80">
                Scheda progetto
              </span>
              <span className="inline-flex rounded-full bg-accent-lime px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
                {p.stato}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{p.nome}</h1>
            <p className="mt-3 font-mono text-sm text-white/80">CUP {p.cup}</p>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">{p.descrizione}</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <button onClick={() => setModal("options")} className="h-11 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur hover:bg-white/16">
              Opzioni
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-violet shadow-[0_12px_30px_rgba(255,255,255,0.2)]">
              <span className="text-lg">...</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <HeroMetaCard label="Settore" value={p.configurazione.settore} />
          <HeroMetaCard label="Localizzazione" value={p.configurazione.localizzazione} />
          <HeroMetaCard label="Durata" value={p.configurazione.durata_progetto} />
        </div>
      </div>

      <p className="mt-5 text-sm">
        <strong>Stato del progetto:</strong> <span className="font-medium">{p.stato}</span>
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiCard title="PIL attivato" value={formatKpiValue(results?.eia?.gva?.totale, "currency")} hint="Da analisi EIA" />
        <KpiCard title="VAN" value={formatKpiValue(results?.ecba?.van, "currency")} hint="Da analisi ECBA" />
        <KpiCard title="Score ESG" value={formatKpiValue(results?.esg?.globale, "score")} hint="Da analisi ESG" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatusSummary title="Configurazione" status="completed" text="Dati progetto completi e disponibili per le analisi." />
        <StatusSummary title="Input analitici" status={inputStatus(analysisState)} text="KPI, assunzioni economiche e questionario ESG." />
        <StatusSummary title="Output" status={outputStatus(analysisState)} text="Risultati generati dalle analisi completate." />
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
        <div className="flex items-center justify-between gap-3 bg-ink-900 px-5 py-4 text-white">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-300">Configurazione</p>
            <p className="mt-1 text-sm font-bold">Dati della configurazione</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            Base progetto
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 text-sm md:grid-cols-2 xl:grid-cols-3">
          <ConfigField label="Settore" value={p.configurazione.settore} />
          <ConfigField label="Sotto-settore" value={p.configurazione.sotto_settore} />
          <ConfigField label="Categoria di intervento" value={p.configurazione.categoria_intervento} />
          <ConfigField label="Tipo intervento" value={p.configurazione.tipo_intervento} />
          <ConfigField label="Durata del progetto" value={p.configurazione.durata_progetto} />
          <ConfigField label="Localizzazione" value={p.configurazione.localizzazione} />
          <ConfigField label="Anno di attualizzazione" value={p.configurazione.anno_attualizzazione} mono />
          <ConfigField label="CAPEX" value={formatCurrency(p.configurazione.capex)} mono />
          <ConfigField label="OPEX" value={formatCurrency(p.configurazione.opex)} mono />
        </div>
        <div className="flex justify-end px-6 pb-5">
          <button onClick={() => setModal("details")} className="flex items-center gap-2 text-sm font-semibold text-brand-violet">
            Vedi maggiori dettagli <IconArrowRight />
          </button>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Le analisi del progetto</h2>
      <div className="mt-5 flex flex-col gap-3">
        <AnalysisCard
          tipo="EIA"
          nome="Analisi di Impatto"
          icon="/icons/analysis-eia.png"
          descrizione="Per stimare gli effetti del progetto su economia locale, occupazione e sviluppo del territorio."
          status={analysisState.eia}
          onOpen={onOpenEia}
          onReset={() => {
            clearAnalysisData(workspaceId, "eia");
            toast({ tone: "success", title: "Risultati EIA cancellati", description: "Puoi configurare ed eseguire nuovamente l'analisi." });
          }}
        />
        <AnalysisCard
          tipo="ECBA"
          nome="Analisi Costi-Benefici"
          icon="/icons/analysis-ecba.png"
          descrizione="Per valutare la convenienza complessiva del progetto pubblico nel medio-lungo periodo."
          status={analysisState.ecba}
          onOpen={onOpenEcba}
          onReset={() => {
            clearAnalysisData(workspaceId, "ecba");
            toast({ tone: "success", title: "Risultati ECBA cancellati", description: "Le assunzioni economiche possono essere reimpostate." });
          }}
        />
        <AnalysisCard
          tipo="ESG"
          nome="Analisi ESG"
          icon="/icons/analysis-esg.png"
          descrizione="Per misurare il grado di allineamento del progetto ai criteri Environmental, Social e Governance."
          status={analysisState.esg}
          onOpen={onOpenEsg}
          onReset={() => {
            clearAnalysisData(workspaceId, "esg");
            toast({ tone: "success", title: "Risultati ESG cancellati", description: "Il questionario è pronto per una nuova compilazione." });
          }}
        />
      </div>

      <DocumentiSection currentUser={user?.name ?? "Mario Rossi"} />

      {modal === "details" ? (
        <Modal title="Dettagli configurazione progetto" onClose={() => setModal(null)}>
          <div className="grid grid-cols-1 gap-5 text-sm md:grid-cols-2">
            {Object.entries(p.configurazione).map(([key, value]) => (
              <div key={key}>
                <p className="font-semibold capitalize">{key.replaceAll("_", " ")}</p>
                <p className="mt-1 text-ink-700">{String(value)}</p>
              </div>
            ))}
          </div>
        </Modal>
      ) : null}

      {modal === "options" ? (
        <Modal title="Opzioni progetto" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setDraftProject(p);
                navigate(`/valutazioni/nuova?editId=${p.id}`);
              }}
              className="block w-full border border-ink-100 px-4 py-3 text-left text-sm font-semibold hover:bg-bg-page"
            >
              Modifica configurazione
            </button>
            <button
              type="button"
              onClick={() => {
                const duplicate = duplicateProject(p.id);
                setModal(null);
                if (duplicate) {
                  toast({ tone: "success", title: "Progetto duplicato", description: "La copia e disponibile nella lista valutazioni." });
                }
              }}
              className="block w-full border border-ink-100 px-4 py-3 text-left text-sm font-semibold hover:bg-bg-page"
            >
              Duplica
            </button>
            <button
              type="button"
              onClick={() => setModal("confirm-delete")}
              className="block w-full border border-rose-200 px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Elimina
            </button>
          </div>
        </Modal>
      ) : null}

      {modal === "confirm-delete" ? (
        <Modal
          title="Elimina progetto"
          onClose={() => setModal(null)}
          onConfirm={() => {
            deleteProject(p.id);
            toast({ tone: "success", title: "Progetto eliminato", description: "Il progetto e stato rimosso dalla demo." });
            navigate("/valutazioni");
          }}
          confirmLabel="Elimina"
        >
          <p className="text-sm leading-relaxed text-ink-700">
            Confermi l'eliminazione di <strong>{p.nome}</strong>? L'azione rimuove anche gli stati delle analisi salvati in locale.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function KpiCard({ title, value, hint }) {
  const done = value !== "—";
  return (
    <div className="rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500">{hint}</p>
        <span className={`h-2.5 w-2.5 rounded-full ${done ? "bg-accent-lime" : "bg-orange-400"}`} />
      </div>
      <p className="mt-3 text-sm font-bold text-ink-700">{title}</p>
      <p className={`mt-4 text-3xl font-bold tracking-tight ${done ? "text-ink-900" : "text-ink-300"}`}>{value}</p>
    </div>
  );
}

function StatusSummary({ title, status, text }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold">{title}</p>
        <StatusChip status={status} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-700">{text}</p>
    </div>
  );
}

function ConfigField({ label, value, mono }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-4 py-4">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className={`mt-2 text-sm text-ink-900 ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
    </div>
  );
}

function AnalysisCard({ tipo, nome, icon, descrizione, status, onOpen, onReset }) {
  const [open, setOpen] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const currentStatus = status?.status || "needs_input";

  const statusColor = currentStatus === "completed" ? "bg-emerald-400" : currentStatus === "running" ? "bg-amber-400" : "bg-orange-400";
  const badgeBg    = currentStatus === "completed" ? "bg-emerald-500" : currentStatus === "running" ? "bg-amber-400" : "bg-orange-400";
  const badgeIcon  = currentStatus === "completed" ? "✓" : currentStatus === "running" ? "⟳" : "!";

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
      <div className={`h-1 ${statusColor}`} />
      <div className="flex flex-wrap items-center gap-5 px-5 py-5">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-violet-soft p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] shrink-0">
          {icon ? <img src={icon} alt="" aria-hidden="true" className="h-full w-full object-contain" /> : null}
          <span className={`absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] font-bold ${badgeBg}`}>
            {badgeIcon}
          </span>
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold">{nome}</h3>
          <Badge type={tipo} />
          <StatusChip status={currentStatus} />
          {status?.updatedAt ? <span className="text-xs text-ink-500">Aggiornata il {status.updatedAt}</span> : null}
        </div>
        {onOpen ? (
          <button
            onClick={onOpen}
            className="flex h-10 items-center gap-2 bg-brand-violet px-4 text-sm font-semibold text-white hover:bg-brand-violet-dark"
          >
            {actionLabel(currentStatus)}
            <IconArrowRight />
          </button>
        ) : null}
        {currentStatus === "completed" ? (
          <button type="button" onClick={() => setShowResetModal(true)} className="text-sm font-semibold text-rose-600">
            Cancella risultati
          </button>
        ) : null}
        <button onClick={() => setOpen(!open)} className={`text-ink-700 transition-transform ${open ? "" : "-rotate-90"}`}>
          <IconChevronDown />
        </button>
      </div>
      {open ? (
        <div className="border-t border-ink-100 bg-[linear-gradient(180deg,_rgba(248,250,252,0.85)_0%,_rgba(255,255,255,1)_100%)] px-5 pb-5 pt-4 md:px-[60px]">
          {currentStatus === "needs_input" ? (
            <EmptyState
              compact
              eyebrow={tipo}
              title={`Analisi ${tipo} non ancora eseguita`}
              description={`${descrizione} Compila gli input richiesti per generare il primo set di risultati.`}
              actionLabel="Inizia analisi"
              onAction={onOpen}
            />
          ) : (
            <p className="text-sm text-ink-700">{descrizione}</p>
          )}
        </div>
      ) : null}
      {showResetModal ? (
        <Modal
          title={`Cancella risultati ${tipo}`}
          onClose={() => setShowResetModal(false)}
          onConfirm={() => {
            onReset?.();
            setShowResetModal(false);
          }}
          confirmLabel="Cancella risultati"
        >
          <p className="text-sm leading-relaxed text-ink-700">
            I risultati salvati per questa analisi verranno rimossi dal progetto corrente. Potrai comunque rilanciare l'analisi in qualsiasi momento.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function HeroMetaCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/60">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function StatusChip({ status }) {
  const cfg = {
    completed:   { cls: "bg-emerald-100 text-emerald-700", label: "Completata",       icon: "✓" },
    running:     { cls: "bg-amber-100 text-amber-700",     label: "In elaborazione",  icon: "⟳" },
    needs_input: { cls: "bg-orange-100 text-orange-700",   label: "Input richiesti",  icon: "!" },
  };
  const { cls, label, icon } = cfg[status] ?? cfg.needs_input;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold ${cls}`}>
      <span>{icon}</span>{label}
    </span>
  );
}

function actionLabel(status) {
  if (status === "completed") return "Vedi risultati";
  if (status === "running") return "Segui elaborazione";
  return "Completa input";
}

function inputStatus(analyses) {
  return Object.values(analyses).every((item) => item.status !== "needs_input") ? "completed" : "needs_input";
}

function outputStatus(analyses) {
  if (Object.values(analyses).every((item) => item.status === "completed")) return "completed";
  if (Object.values(analyses).some((item) => item.status === "running")) return "running";
  return "needs_input";
}

function formatKpiValue(value, type) {
  if (value == null) return "—";
  if (type === "score") return `${Math.round(value)}/100`;
  return `${new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(Math.round(value))} €`;
}

const SORT_OPTIONS = ["Data di creazione", "Nome", "Proprietario"];

const INITIAL_DOCS = [
  { id: 1, nome: "Quadro economico finanziario.xls", data: "12/10/2025", proprietario: "Mario Rossi", tipo: "xls" },
  { id: 2, nome: "Relazione tecnica.pdf", data: "14/10/2025", proprietario: "Mario Rossi", tipo: "pdf" },
  { id: 3, nome: "Piano degli investimenti.xlsx", data: "15/11/2025", proprietario: "Guido di Toro Mammarella", tipo: "xls" },
];

function DocumentiSection({ currentUser }) {
  const [activeTab, setActiveTab] = useState("caricati");
  const [sortBy, setSortBy] = useState("Data di creazione");
  const [viewMode, setViewMode] = useState("lista");
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);

  function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newDocs = files.map((f) => ({
      id: Date.now() + Math.random(),
      nome: f.name,
      data: new Date().toLocaleDateString("it-IT"),
      proprietario: currentUser,
      tipo: f.name.split(".").pop().toLowerCase(),
    }));
    setDocs((prev) => [...newDocs, ...prev]);
    e.target.value = "";
  }

  function handleDelete(id) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeleteTarget(null);
  }

  const sorted = [...docs].sort((a, b) => {
    if (sortBy === "Nome") return a.nome.localeCompare(b.nome);
    if (sortBy === "Proprietario") return a.proprietario.localeCompare(b.proprietario);
    return 0;
  });

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">Documentazione di progetto</h2>

      <div className="mt-4 bg-white border border-ink-100 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="flex border-b border-ink-100">
          <TabBtn active={activeTab === "caricati"} onClick={() => setActiveTab("caricati")}>
            Documenti caricati
          </TabBtn>
          <TabBtn active={activeTab === "prodotti"} onClick={() => setActiveTab("prodotti")}>
            Documenti prodotti da OpenEconomics
          </TabBtn>
        </div>

        {activeTab === "caricati" && (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <div className="flex items-center gap-2 text-sm text-ink-700">
                <span className="font-medium">Ordina per:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-ink-200 px-3 py-1.5 text-sm bg-white rounded-sm"
                >
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="flex border border-ink-200 overflow-hidden ml-auto">
                <button
                  onClick={() => setViewMode("lista")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold transition-colors ${viewMode === "lista" ? "bg-brand-violet text-white" : "text-ink-700 hover:bg-ink-50"}`}
                >
                  <IconList className="w-4 h-4" />
                  Lista
                </button>
                <button
                  onClick={() => setViewMode("griglia")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold transition-colors border-l border-ink-200 ${viewMode === "griglia" ? "bg-brand-violet text-white" : "text-ink-700 hover:bg-ink-50"}`}
                >
                  <IconGrid className="w-4 h-4" />
                  Griglia
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xls,.xlsx,.docx,.jpeg,.jpg"
                className="hidden"
                onChange={handleUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-semibold text-brand-violet hover:underline"
              >
                Carica documento (pdf, xls, docx, jpeg)
                <IconUpload className="w-4 h-4" />
              </button>
            </div>

            {viewMode === "lista" ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100">
                    <th className="text-left font-semibold text-ink-500 pb-2 pr-4 w-8" />
                    <th className="text-left font-semibold text-ink-500 pb-2 pr-4">Nome del documento</th>
                    <th className="text-left font-semibold text-ink-500 pb-2 pr-4">Data di creazione</th>
                    <th className="text-left font-semibold text-ink-500 pb-2 pr-4">Proprietario</th>
                    <th className="pb-2" />
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((doc) => {
                    const isOwner = doc.proprietario === currentUser;
                    return (
                      <tr key={doc.id} className="border-b border-ink-50 hover:bg-ink-50/40">
                        <td className="py-3 pr-4">
                          <FileTypeBadge tipo={doc.tipo} />
                        </td>
                        <td className="py-3 pr-4 font-semibold">{doc.nome}</td>
                        <td className="py-3 pr-4 text-ink-600">{doc.data}</td>
                        <td className="py-3 pr-4 text-ink-600">{doc.proprietario}</td>
                        <td className="py-3 pr-4 text-right">
                          <button className="flex items-center gap-1.5 text-brand-violet font-semibold hover:underline whitespace-nowrap">
                            Scarica <IconDownload className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            disabled={!isOwner}
                            onClick={() => isOwner && setDeleteTarget(doc)}
                            className={`flex items-center gap-1.5 font-semibold whitespace-nowrap ${isOwner ? "text-rose-600 hover:underline" : "text-ink-300 cursor-not-allowed"}`}
                          >
                            Elimina <IconTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-ink-400">
                        Nessun documento caricato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sorted.map((doc) => {
                  const isOwner = doc.proprietario === currentUser;
                  return (
                    <div key={doc.id} className="border border-ink-100 p-4 flex flex-col items-center text-center gap-2">
                      <FileTypeBadge tipo={doc.tipo} large />
                      <p className="text-xs font-semibold break-all">{doc.nome}</p>
                      <p className="text-xs text-ink-500">{doc.data}</p>
                      <div className="flex gap-3 mt-1">
                        <button className="text-xs text-brand-violet font-semibold hover:underline">Scarica</button>
                        <button
                          disabled={!isOwner}
                          onClick={() => isOwner && setDeleteTarget(doc)}
                          className={`text-xs font-semibold ${isOwner ? "text-rose-600 hover:underline" : "text-ink-300 cursor-not-allowed"}`}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  );
                })}
                {sorted.length === 0 && (
                  <p className="col-span-4 py-8 text-center text-sm text-ink-400">Nessun documento caricato.</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "prodotti" && (
          <div className="p-8 text-center text-sm text-ink-400">
            I documenti prodotti da OpenEconomics saranno disponibili al completamento delle analisi.
          </div>
        )}
      </div>

      {deleteTarget && (
        <Modal
          title="Elimina documento"
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
          confirmLabel="Elimina"
        >
          <p className="text-sm leading-relaxed text-ink-700">
            Confermi l'eliminazione di <strong>{deleteTarget.nome}</strong>? L'operazione non è reversibile.
          </p>
        </Modal>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${active ? "border-brand-violet text-brand-violet" : "border-transparent text-ink-500 hover:text-ink-900"}`}
    >
      {children}
    </button>
  );
}

function FileTypeBadge({ tipo, large = false }) {
  const colorMap = {
    xls: "bg-emerald-100 text-emerald-700",
    xlsx: "bg-emerald-100 text-emerald-700",
    pdf: "bg-rose-100 text-rose-700",
    docx: "bg-blue-100 text-blue-700",
    doc: "bg-blue-100 text-blue-700",
    jpeg: "bg-amber-100 text-amber-700",
    jpg: "bg-amber-100 text-amber-700",
  };
  const color = colorMap[tipo] || "bg-ink-100 text-ink-600";
  const size = large ? "w-12 h-14" : "w-8 h-9";
  return (
    <div className={`${size} ${color} flex flex-col items-center justify-center rounded-sm relative`}>
      <IconFile className={large ? "w-6 h-6" : "w-4 h-4"} />
      <span className="text-[8px] font-bold uppercase mt-0.5">{tipo}</span>
    </div>
  );
}
