import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useProjects } from "./contexts/ProjectContext";
import { Layout } from "./components/Layout";
import { LoginV1 } from "./components/v1/LoginV1";
import { ValutazioniListV1 } from "./components/v1/ValutazioniListV1";
import { WizardV1 } from "./components/v1/WizardV1";
import { ProjectDetailV1 } from "./components/v1/ProjectDetailV1";
import { EiaScenario } from "./components/EiaScenario";

// Lazy-loaded per escludere Plotly dal bundle principale
const EiaResultsV1 = lazy(() =>
  import("./components/v1/EiaResultsV1").then((m) => ({ default: m.EiaResultsV1 })),
);
const EcbaResultsV1 = lazy(() =>
  import("./components/v1/EcbaResultsV1").then((m) => ({ default: m.EcbaResultsV1 })),
);
const EsgResultsV1 = lazy(() =>
  import("./components/v1/EsgResultsV1").then((m) => ({ default: m.EsgResultsV1 })),
);
import { ConfigurationSummary } from "./components/ConfigurationSummary";
import { ConfigurationComplete } from "./components/ConfigurationComplete";
import { ValutazioneIntroV1 } from "./components/v1/ValutazioneIntroV1";
import { AnalysisRunning } from "./components/AnalysisRunning";
import { EiaRunning } from "./components/EiaRunning";
import { computeEia } from "./lib/eiaEngine";
import { computeEcba } from "./lib/ecbaEngine";
import { computeEsg } from "./lib/esgEngine";
import { EsgQuestionnaire } from "./components/EsgQuestionnaire";
import { EcbaSetup } from "./components/EcbaSetup";
import { Skeleton, SkeletonText } from "./components/ui/Skeleton";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutRoute />}>
          <Route path="/" element={<Navigate to="/valutazioni" replace />} />
          <Route path="/valutazioni" element={<ValutazioniListRoute />} />
          <Route path="/valutazioni/nuova/intro" element={<ValutazioneIntroRoute />} />
          <Route path="/valutazioni/nuova" element={<WizardRoute />} />
          <Route path="/valutazioni/nuova/riepilogo" element={<ConfigurationSummaryRoute />} />
          <Route path="/valutazioni/nuova/completata" element={<ConfigurationCompleteRoute />} />
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
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/valutazioni" replace />} />
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

function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function LoginScreen() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/valutazioni"} replace />;
  }

  return <LoginV1 />;
}

function ValutazioniListRoute() {
  const navigate = useNavigate();

  return (
    <ValutazioniListV1
      onOpenProject={(id) => navigate(`/valutazioni/${id}`)}
      onNewEvaluation={() => navigate("/valutazioni/nuova/intro")}
    />
  );
}

function ValutazioneIntroRoute() {
  const navigate = useNavigate();

  return (
    <ValutazioneIntroV1
      onContinua={() => navigate("/valutazioni/nuova")}
      onClose={() => navigate("/valutazioni")}
    />
  );
}

function WizardRoute() {
  const navigate = useNavigate();
  const { draftProject, setDraftProject } = useProjects();
  const editId = new URLSearchParams(window.location.search).get("editId");

  return (
    <WizardV1
      initialProject={draftProject}
      onClose={() => navigate("/valutazioni")}
      onComplete={(nextProject) => {
        setDraftProject(nextProject);
        navigate(`/valutazioni/nuova/riepilogo${editId ? `?editId=${editId}` : ""}`);
      }}
    />
  );
}

function ConfigurationSummaryRoute() {
  const navigate = useNavigate();
  const { draftProject, setDraftProject, addProject, saveProjectConfig } = useProjects();
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
        navigate(`/valutazioni/nuova/completata?projectId=${projectId}`);
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
      project={workspace.project}
      analyses={workspace.analyses}
      onOpenProject={() => navigate(`/valutazioni/${workspace.id}`)}
      onOpenEia={() => navigate(`/valutazioni/${workspace.id}/eia`)}
      onOpenEcba={() => navigate(`/valutazioni/${workspace.id}/ecba`)}
      onOpenEsg={() => navigate(`/valutazioni/${workspace.id}/esg`)}
    />
  );
}

function ProjectDetailRoute() {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  if (!workspace) return <Navigate to="/valutazioni" replace />;

  return (
    <ProjectDetailV1
      project={workspace.project}
      analyses={workspace.analyses}
      results={{
        eia: workspace.eiaResults ?? null,
        ecba: workspace.ecbaResults ?? null,
        esg: workspace.esgResults ?? null,
      }}
      workspaceId={workspace.id}
      onBack={() => navigate("/valutazioni")}
      onOpenEia={() => navigateToAnalysis(workspace, "eia", navigate)}
      onOpenEcba={() => navigateToAnalysis(workspace, "ecba", navigate)}
      onOpenEsg={() => navigateToAnalysis(workspace, "esg", navigate)}
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
      <EiaResultsV1
        project={workspace.project}
        eiaResults={workspace.eiaResults ?? null}
        scenario={workspace.eiaInputs}
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
      <EcbaResultsV1
        project={workspace.project}
        ecbaResults={workspace.ecbaResults ?? null}
        assumptions={workspace.ecbaInputs}
        analysis={workspace.analyses.ecba}
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
      project={workspace.project}
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
    <AnalysisRunning
      title="Analisi ESG"
      onBack={() => navigate(`/valutazioni/${workspace.id}`)}
      onComplete={() => {
        const settore = workspace.project?.configurazione?.settore ?? "";
        const results = computeEsg(workspace.esgAnswers ?? {}, settore, workspace.eiaResults ?? null);
        saveAnalysisInputs(workspace.id, "esgResults", results);
        updateAnalysis(workspace.id, "esg", { status: "completed" });
        navigate(`/valutazioni/${workspace.id}/esg/results`);
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
      <EsgResultsV1
        project={workspace.project}
        esgResults={workspace.esgResults ?? null}
        answers={workspace.esgAnswers}
        analysis={workspace.analyses.esg}
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
  const analysis = workspace.analyses[analysisId];
  const basePath = `/valutazioni/${workspace.id}/${analysisId}`;

  if (analysis.status === "completed") {
    navigate(`${basePath}/results`);
    return;
  }

  if (analysis.status === "running") {
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
