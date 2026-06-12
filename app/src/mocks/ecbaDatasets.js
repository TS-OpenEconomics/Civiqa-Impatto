// Registro dei dataset ECBA (forma ecbaData.js) per la vista di dettaglio.
// Come per gli EIA, `EcbaResults` seleziona qui il dataset in base al progetto.
// Aggiungere nuovi progetti = aggiungere una voce a ECBA_DATASETS.
//
// Il default (`ECBA_DATA`) resta il mock storico (asilo nido): i progetti senza
// un export ACB dedicato continuano a mostrarlo come prima.
import { ECBA_DATA } from "../components/ecbaData";
import { MUBA_ECBA_DATASET } from "./mubaProject";

export const ECBA_DATASETS = {
  "PROJ-MUBA-976": MUBA_ECBA_DATASET,
};

export function getEcbaDataset(project) {
  const id = typeof project === "string" ? project : project?.id;
  return (id && ECBA_DATASETS[id]) || ECBA_DATA;
}
