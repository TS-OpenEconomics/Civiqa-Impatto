import { AnalysisRunning } from "./AnalysisRunning";

export function EiaRunning({ onComplete, onBackToProject }) {
  return (
    <AnalysisRunning
      title="Analisi di Impatto"
      onComplete={onComplete}
      onBack={onBackToProject}
    />
  );
}
