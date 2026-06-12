// Registro dei dataset EIA (forma ricca eiaResults.json) per la vista di dettaglio.
// La vista `EiaResults` non è più legata a un solo mock: seleziona qui il dataset
// in base al progetto. Aggiungere nuovi progetti = aggiungere una voce a EIA_DATASETS.
//
// Il default (`staticResults`) resta il mock storico (Palermo): tutti i progetti
// seed/demo senza un export dedicato continuano a mostrarlo come prima.
import staticResults from "./eiaResults.json";
import { MUBA_EIA_DATASET } from "./mubaProject";

export const EIA_DATASETS = {
  "PROJ-MUBA-976": MUBA_EIA_DATASET,
};

// Restituisce il dataset EIA da mostrare per un progetto, con fallback al mock.
export function getEiaDataset(project) {
  const id = typeof project === "string" ? project : project?.id;
  return (id && EIA_DATASETS[id]) || staticResults;
}
