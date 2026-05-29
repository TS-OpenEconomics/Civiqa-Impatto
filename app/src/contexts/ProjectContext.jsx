/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildSeedProjects,
  createEmptyDraftProject,
  createWorkspace,
  duplicateProjectWorkspace,
  nowLabel,
  readProjectsState,
  readUiState,
  touchProject,
  writeProjectsState,
  writeUiState,
} from "../lib/projectState";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(readProjectsState);
  const [draftProject, setDraftProject] = useState(createEmptyDraftProject);
  const [uiState, setUiState] = useState(readUiState);

  useEffect(() => {
    writeProjectsState(projects);
  }, [projects]);

  useEffect(() => {
    writeUiState(uiState);
  }, [uiState]);

  const value = useMemo(
    () => ({
      projects,
      draftProject,
      uiState,
      setDraftProject,
      setSearchTerm(searchTerm) {
        setUiState((prev) => ({ ...prev, searchTerm }));
      },
      setDebouncedSearchTerm(debouncedSearchTerm) {
        setUiState((prev) => ({ ...prev, debouncedSearchTerm }));
      },
      toggleSectorFilter(filter) {
        setUiState((prev) => {
          const current = prev.sectorFilters.includes(filter)
            ? prev.sectorFilters.filter((item) => item !== filter)
            : [...prev.sectorFilters, filter];
          return { ...prev, sectorFilters: current };
        });
      },
      setSortMode(sortMode) {
        setUiState((prev) => ({ ...prev, sortMode }));
      },
      getProject(id) {
        return projects.find((item) => item.id === id) || null;
      },
      addProject(project) {
        const nextId = ensureUniqueProjectId(project.id, projects);
        const workspace = createWorkspace(touchProject({ ...project, id: nextId }));
        setProjects((prev) => [workspace, ...prev]);
        return workspace;
      },
      saveProjectConfig(existingId, project) {
        setProjects((prev) =>
          prev.map((item) =>
            item.id === existingId
              ? {
                  ...item,
                  id: existingId,
                  project: touchProject({ ...project, id: existingId }),
                }
              : item,
          ),
        );
        return existingId;
      },
      saveAnalysisInputs(id, key, value) {
        setProjects((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  [key]: value,
                }
              : item,
          ),
        );
      },
      updateAnalysis(id, analysisId, patch) {
        setProjects((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  analyses: {
                    ...item.analyses,
                    [analysisId]: {
                      ...item.analyses[analysisId],
                      ...patch,
                      updatedAt: patch.updatedAt ?? nowLabel(),
                    },
                  },
                }
              : item,
          ),
        );
      },
      duplicateProject(id) {
        const workspace = projects.find((item) => item.id === id);
        if (!workspace) return null;
        const duplicate = duplicateProjectWorkspace(workspace);
        setProjects((prev) => [duplicate, ...prev]);
        return duplicate;
      },
      deleteProject(id) {
        setProjects((prev) => {
          const next = prev.filter((item) => item.id !== id);
          return next.length > 0 ? next : buildSeedProjects();
        });
      },
      clearAnalysisData(id, analysisId) {
        setProjects((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;

            const reset = {
              eia: { eiaInputs: null, eiaResults: null },
              ecba: { ecbaInputs: null, ecbaResults: null },
              esg: { esgAnswers: null, esgResults: null },
            }[analysisId];

            if (!reset) return item;

            return {
              ...item,
              ...reset,
              analyses: {
                ...item.analyses,
                [analysisId]: {
                  status: "needs_input",
                  updatedAt: nowLabel(),
                },
              },
            };
          }),
        );
      },
    }),
    [draftProject, projects, uiState],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used inside ProjectProvider");
  }
  return context;
}

function ensureUniqueProjectId(projectId, projects) {
  const fallback = projectId || `PROJ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (!projects.some((item) => item.id === fallback)) {
    return fallback;
  }
  return `PROJ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
