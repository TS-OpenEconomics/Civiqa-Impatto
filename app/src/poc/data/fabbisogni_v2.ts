// Single source of truth — re-export from poc bundle
export type { Need } from './poc_docfap/fabbisogni_v2'
export {
  NEEDS,
  NEEDS_DOCFAP,
  NEEDS_DATAROOM,
  NEEDS_FUNDING_GAP,
  getNeedByCode,
  getNeedsByTheme,
  getNeedsByMission,
  getNeedsByCategoryCode,
  getNeedsByCluster,
} from './poc_docfap/fabbisogni_v2'
