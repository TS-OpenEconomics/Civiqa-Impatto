import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useProjects } from "./contexts/ProjectContext";
import { Login } from "./components/Login";
import { ValutazioniList } from "./components/ValutazioniList";
import { Wizard } from "./components/Wizard";
import { ProjectDetail } from "./components/ProjectDetail";
import { EiaScenario } from "./components/EiaScenario";

// Lazy-loaded per escludere Plotly dal bundle principale
const EiaResults = lazy(() =>
  import("./components/EiaResults").then((m) => ({ default: m.EiaResults })),
);
const EcbaResults = lazy(() =>
  import("./components/EcbaResults").then((m) => ({ default: m.EcbaResults })),
);
const EsgResults = lazy(() =>
  import("./components/EsgResults").then((m) => ({ default: m.EsgResults })),
);
import { ConfigurationSummary } from "./components/ConfigurationSummary";
import { ConfigurationComplete } from "./components/ConfigurationComplete";
import { ValutazioneIntro } from "./components/ValutazioneIntro";
import { AnalysisRunning } from "./components/AnalysisRunning";
import { AnalysisRunningBoth } from "./components/AnalysisRunningBoth";
import { EiaRunning } from "./components/EiaRunning";
import { EsgRunning } from "./components/EsgRunning";
import { computeEia } from "./lib/eiaEngine";
import { computeEcba } from "./lib/ecbaEngine";
import { computeEsg } from "./lib/esgEngine";
import { createEmptyDraftProject } from "./lib/projectState";
import { EsgQuestionnaire } from "./components/EsgQuestionnaire";
import { EcbaSetup } from "./components/EcbaSetup";
import { Skeleton, SkeletonText } from "./components/ui/Skeleton";
// --- Civiqa_POC sections, ported and re-skinned (see INTEGRAZIONE_CIVIQA.md) ---
import {
  AppShell,
  HomeLauncher,
  PocPage,
  ImpattDashboard,
  DocfapList,
  DocfapDetail,
  DocfapMcaDetail,
  PianificazioneModule,
  DataRoomPage,
  RisorsePage,
  ComposingPlaceholder,
  GeniePlaceholder,
} from "./poc";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        {/* Home — launcher a 3 fasi, a tutto schermo (fuori dall'AppShell) */}
        <Route path="/" element={<HomeLauncher />} />
        {/* Tutte le sezioni prodotto condividono l'AppShell (TopNav + SideNav) */}
        <Route element={<AppShell />}>
          <Route path="/valutazioni" element={<ValutazioniListRoute />} />
          <Route path="/valutazioni/nuova/intro" element={<ValutazioneIntroRoute />} />
          <Route path="/valutazioni/nuova" element={<WizardRoute />} />
          <Route path="/valutazioni/nuova/riepilogo" element={<ConfigurationSummaryRoute />} />
          <Route path="/valutazioni/nuova/completata" element={<ConfigurationCompleteRoute />} />
          <Route path="/valutazioni/:id/running-both" element={<RunningBothRoute />} />
          <Route path="/valutazioni/:id" element={<ProjectDetailRoute />} />
          <Route path="/valutazioni/:id/eia" element={<EiaInputRoute />} />
          <Route path="/valutazioni/:id/eia/running" element={<EiaRunningRoute />} />
          <Route path="/valutazioni/:id/eia/results" element={<EiaResultsRoute />} />
          <Route path="/valutazioni/:id/ecba" element={<EcbaSetupRoute />} />
          <Route path="/valutazioni/:id/ecba/running" element={<EcbaRunningRoute />} />
          <Route path="/valutazioni/:id/ecba/results" element={<EcbaResultsRoute />} />
          <Route path="/valutazioni/:id/esg" element={<EsgFormRoute />} />
          <Route path="/valutazioni/:id/esg/running" element={<EsgRunningRoute />} />
          <Route path="/valutazioni/:id/esg/results" element={<EsgResultsRoute />} />

          {/* ── Sezioni Impatti (ex Civiqa_POC) — chrome di app/, contenuto POC ── */}
          {/* Dashboard temporaneamente nascosta: ingresso sezione = Docfap */}
          <Route path="/impatti" element={<Navigate to="/impatti/docfap" replace />} />
          <Route path="/impatti/dashboard" element={<PocPage><ImpattDashboard /></PocPage>} />
          <Route path="/impatti/docfap" element={<PocPage><DocfapList /></PocPage>} />
          {/* Sintesi DOCFAP + dettaglio MCA: layout Tailwind del modulo /valutazioni → montati RAW
              (fuori da PocPage, il cui reset border-radius:0 azzererebbe gli angoli Tailwind). */}
          <Route path="/impatti/docfap/detail" element={<DocfapDetail />} />
          <Route path="/impatti/docfap/mca/:option" element={<DocfapMcaDetail />} />
          <Route path="/impatti/pianificazione" element={<PocPage><PianificazioneModule /></PocPage>} />
          <Route path="/impatti/composing" element={<PocPage><ComposingPlaceholder /></PocPage>} />
          {/* La "Valutazione" della POC è sostituita dal modulo impatto di app/ */}
          <Route path="/impatti/valutazione" element={<Navigate to="/valutazioni" replace />} />

          {/* ── Strumenti ── */}
          <Route path="/genie" element={<GeniePlaceholder />} />
          <Route path="/data-room" element={<PocPage><DataRoomPage /></PocPage>} />
          <Route path="/risorse" element={<PocPage><RisorsePage /></PocPage>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function LoginScreen() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  return <Login />;
}

function ValutazioniListRoute() {
  const navigate = useNavigate();
  const { setDraftProject } = useProjects();

  return (
    <ValutazioniList
      onOpenProject={(id) => navigate(`/valutazioni/${id}`)}
      onOpenAnalysis={(id, analysis) => navigate(`/valutazioni/${id}/${analysis.toLowerCase()}/results`)}
      onNewEvaluation={() => {
        setDraftProject(createEmptyDraftProject());
        navigate("/valutazioni/nuova/intro");
      }}
    />
  );
}

function ValutazioneIntroRoute() {
  const navigate = useNavigate();

  return (
    <ValutazioneIntro
      onContinua={() => navigate("/valutazioni/nuova")}
      onClose={() => navigate("/valutazioni")}
    />
  );
}

function WizardRoute() {
  const navigate = useNavigate();
  const { draftProject, setDraftProject, addProject, saveProjectConfig } = useProjects();
  const editId = new URLSearchParams(window.location.search).get("editId");

  return (
    <Wizard
      initialProject={draftProject}
      onClose={() => navigate("/valutazioni")}
      onComplete={(nextProject) => {
        setDraftProject(nextProject);
        navigate(`/valutazioni/nuova/riepilogo${editId ? `?editId=${editId}` : ""}`);
      }}
      onSaveDraft={(draftAsProject) => {
        const bozza = { ...draftAsProject, stato: draftAsProject.stato || "In preparazione" };
        if (editId) {
          saveProjectConfig(editId, bozza);
        } else {
          addProject(bozza);
        }
        setDraftProject(null);
        navigate("/valutazioni");
      }}
    />
  );
}

function buildEiaScenario(project) {
  const c = project.configurazione ?? {};
  const anno_inizio = c.data_fine
    ? new Date(c.data_fine + "T00:00:00").getFullYear() + 1
    : (c.anno_attualizzazione ?? 2025);
  const vita_utile = c.vita_utile ?? 20;
  return {
    settore: c.settore || "",
    nuts_code: c.nuts_code || "",
    nuts_label: c.nuts_label || c.localizzazione || "",
    capex: c.capex ?? 0,
    opex_annuo: c.opex ?? 0,
    vita_utile,
    anno_inizio,
    anno_fine: anno_inizio + vita_utile - 1,
    capex_distribuzione: c.capex_distribuzione ?? null,
    spese_aggiuntive: [],
    granularita: "regionale",
    tipo: "completa",
  };
}

function buildEcbaInputs(project) {
  const c = project.configurazione ?? {};
  return {
    horizon: c.vita_utile ?? 25,
    discountRate: 3.5,
    residualValue: c.capex ? Math.round(c.capex * 0.1) : 0,
    benefitItems: { gva: true, gettito: true, redditi: false, intangibili: false, intangibiliValue: "" },
  };
}

function ConfigurationSummaryRoute() {
  const navigate = useNavigate();
  const { draftProject, setDraftProject, addProject, saveProjectConfig, saveAnalysisInputs, updateAnalysis } = useProjects();
  const editId = new URLSearchParams(window.location.search).get("editId");

  return (
    <ConfigurationSummary
      project={draftProject}
      onClose={() => navigate("/valutazioni")}
      onBack={() => navigate(`/valutazioni/nuova${editId ? `?editId=${editId}` : ""}`)}
      onConfirm={(nextProject) => {
        setDraftProject(nextProject);
        const projectId = editId
          ? saveProjectConfig(editId, nextProject)
          : addProject(nextProject).id;

        // Auto-start EIA + ECBA
        const eiaScenario = buildEiaScenario(nextProject);
        const ecbaInputs = buildEcbaInputs(nextProject);
        saveAnalysisInputs(projectId, "eiaInputs", eiaScenario);
        saveAnalysisInputs(projectId, "ecbaInputs", ecbaInputs);
        updateAnalysis(projectId, "eia", { status: "running" });
        updateAnalysis(projectId, "ecba", { status: "running" });

        navigate(`/valutazioni/${projectId}/running-both`);
      }}
    />
  );
}

function RunningBothRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <AnalysisRunningBoth
      onBackToProject={() => navigate(`/valutazioni/${workspace.id}`)}
      onOpenEsg={() => navigate(`/valutazioni/${workspace.id}/esg`)}
      onComplete={() => {
        const eiaResults = computeEia(workspace.project, workspace.eiaInputs);
        saveAnalysisInputs(workspace.id, "eiaResults", eiaResults);
        updateAnalysis(workspace.id, "eia", { status: "completed" });

        const ecbaResults = computeEcba(workspace.project, eiaResults, workspace.ecbaInputs);
        saveAnalysisInputs(workspace.id, "ecbaResults", ecbaResults);
        updateAnalysis(workspace.id, "ecba", { status: "completed" });
      }}
    />
  );
}

function ConfigurationCompleteRoute() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const projectId = new URLSearchParams(window.location.search).get("projectId");
  const workspace = projects.find((item) => item.id === projectId) || projects[0];

  return (
    <ConfigurationComplete
      onOpenProject={() => navigate(`/valutazioni/${workspace.id}`)}
      onOpenEia={() => navigate(`/valutazioni/${workspace.id}/eia`)}
      onOpenEcba={() => navigate(`/valutazioni/${workspace.id}/ecba`)}
      onOpenEsg={() => navigate(`/valutazioni/${workspace.id}/esg`)}
    />
  );
}

function ProjectDetailRoute() {
  const navigate = useNavigate();
  const { setDraftProject, duplicateProject, deleteProject } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <ProjectDetail
      project={workspace.project}
      analyses={workspace.analyses}
      results={{
        eia: workspace.eiaResults ?? null,
        ecba: workspace.ecbaResults ?? null,
        esg: workspace.esgResults ?? null,
      }}
      onBack={() => navigate("/valutazioni")}
      onOpenEia={() => navigateToAnalysis(workspace, "eia", navigate)}
      onOpenEcba={() => navigateToAnalysis(workspace, "ecba", navigate)}
      onOpenEsg={() => navigateToAnalysis(workspace, "esg", navigate)}
      onEdit={() => {
        setDraftProject(workspace.project);
        navigate(`/valutazioni/nuova?editId=${workspace.id}`);
      }}
      onDuplicate={() => {
        const next = duplicateProject(workspace.id);
        if (next) navigate(`/valutazioni/${next.id}`);
      }}
      onDelete={() => {
        deleteProject(workspace.id);
        navigate("/valutazioni");
      }}
    />
  );
}

function EiaInputRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <EiaScenario
      project={workspace.project}
      initialScenario={workspace.eiaInputs}
      onClose={() => navigate(`/valutazioni/${workspace.id}`)}
      onRun={(scenario) => {
        saveAnalysisInputs(workspace.id, "eiaInputs", scenario);
        updateAnalysis(workspace.id, "eia", { status: "running" });
        navigate(`/valutazioni/${workspace.id}/eia/running`);
      }}
    />
  );
}

function EiaRunningRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <EiaRunning
      scenario={workspace.eiaInputs}
      project={workspace.project}
      onBackToProject={() => navigate(`/valutazioni/${workspace.id}`)}
      onComplete={() => {
        const results = computeEia(workspace.project, workspace.eiaInputs);
        saveAnalysisInputs(workspace.id, "eiaResults", results);
        updateAnalysis(workspace.id, "eia", { status: "completed" });
        navigate(`/valutazioni/${workspace.id}/eia/results`);
      }}
    />
  );
}

function EiaResultsRoute() {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <Suspense fallback={<ResultsPageFallback />}>
      <EiaResults
        project={workspace.project}
        eiaResults={workspace.eiaResults ?? null}
        analysis={workspace.analyses.eia}
        onBack={() => navigate(`/valutazioni/${workspace.id}`)}
      />
    </Suspense>
  );
}

function EcbaSetupRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <EcbaSetup
      project={workspace.project}
      eiaResults={workspace.eiaResults ?? null}
      initialValues={workspace.ecbaInputs}
      onClose={() => navigate(`/valutazioni/${workspace.id}`)}
      onRun={(values) => {
        saveAnalysisInputs(workspace.id, "ecbaInputs", values);
        updateAnalysis(workspace.id, "ecba", { status: "running" });
        navigate(`/valutazioni/${workspace.id}/ecba/running`);
      }}
    />
  );
}

function EcbaRunningRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <AnalysisRunning
      title="Analisi Costi-Benefici"
      onBack={() => navigate(`/valutazioni/${workspace.id}`)}
      onComplete={() => {
        const results = computeEcba(workspace.project, workspace.eiaResults ?? null, workspace.ecbaInputs);
        saveAnalysisInputs(workspace.id, "ecbaResults", results);
        updateAnalysis(workspace.id, "ecba", { status: "completed" });
        navigate(`/valutazioni/${workspace.id}/ecba/results`);
      }}
    />
  );
}

function EcbaResultsRoute() {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <Suspense fallback={<ResultsPageFallback />}>
      <EcbaResults
        project={workspace.project}
        ecbaResults={workspace.ecbaResults ?? null}
        assumptions={workspace.ecbaInputs}
        onBack={() => navigate(`/valutazioni/${workspace.id}`)}
      />
    </Suspense>
  );
}

function EsgFormRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <EsgQuestionnaire
      eiaResults={workspace.eiaResults ?? null}
      initialAnswers={workspace.esgAnswers}
      onClose={() => navigate(`/valutazioni/${workspace.id}`)}
      onComplete={(answers) => {
        saveAnalysisInputs(workspace.id, "esgAnswers", answers);
        updateAnalysis(workspace.id, "esg", { status: "running" });
        navigate(`/valutazioni/${workspace.id}/esg/running`);
      }}
    />
  );
}

function EsgRunningRoute() {
  const navigate = useNavigate();
  const { saveAnalysisInputs, updateAnalysis } = useProjects();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <EsgRunning
      onBackToProject={() => navigate(`/valutazioni/${workspace.id}`)}
      onComplete={() => {
        const settore = workspace.project?.configurazione?.settore ?? "";
        const results = computeEsg(workspace.esgAnswers ?? {}, settore, workspace.eiaResults ?? null);
        saveAnalysisInputs(workspace.id, "esgResults", results);
        updateAnalysis(workspace.id, "esg", { status: "completed" });
      }}
    />
  );
}

function EsgResultsRoute() {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <Suspense fallback={<ResultsPageFallback />}>
      <EsgResults
        project={workspace.project}
        esgResults={workspace.esgResults ?? null}
        onBack={() => navigate(`/valutazioni/${workspace.id}`)}
      />
    </Suspense>
  );
}

function useWorkspace() {
  const { id } = useParams();
  const { getProject } = useProjects();
  return getProject(id);
}

function navigateToAnalysis(workspace, analysisId, navigate) {
  const analysis = workspace.analyses?.[analysisId];
  const basePath = `/valutazioni/${workspace.id}/${analysisId}`;

  if (analysis?.status === "completed") {
    navigate(`${basePath}/results`);
    return;
  }

  if (analysis?.status === "running") {
    navigate(`${basePath}/running`);
    return;
  }

  navigate(basePath);
}

function ResultsPageFallback() {
  return (
    <div className="px-6 py-8 md:px-10">
      <div className="dots-violet-bg px-6 py-8 md:px-10">
        <Skeleton className="h-4 w-48" />
        <div className="mt-5 bg-white px-6 py-6">
          <Skeleton className="h-7 w-64" />
          <SkeletonText lines={2} className="mt-4 max-w-xl" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <div className="mt-6 bg-white p-6">
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
}
