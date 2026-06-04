import { CATEGORIE } from "./mockTaxonomy"
/* ══════════════════════════════════════════════════════════════
   mockDataRoom.ts — Dati dell'ente mock (Comune di Colleferro)
   Valori dell'ente vs media nazionale per ogni indicatore
   ══════════════════════════════════════════════════════════════ */

export interface EnteProfile {
  nome: string
  regione: string
  provincia: string
  popolazione: number
  superficie: number
  fasciaPopolazione: string
  cluster: string
}

export const ENTE: EnteProfile = {
  nome: 'Comune di Colleferro',
  regione: 'Lazio',
  provincia: 'Roma',
  popolazione: 22_000,
  superficie: 84.2,
  fasciaPopolazione: '10k-50k',
  cluster: 'Comuni piccoli-medi del Centro Italia',
}

export interface ValoreIndicatore {
  indicatoreId: string
  valoreEnte: number
  mediaCluster: number
  trend: 'up' | 'down' | 'stable'
  gap: number         // differenza % rispetto a media nazionale (negativo = sotto media)
  gapCluster: number  // differenza % rispetto a media cluster
}

export const VALORI_ENTE: ValoreIndicatore[] = [
  // Ambiente
  { indicatoreId: 'amb-01', valoreEnte: 11.2, mediaCluster: 9.1, trend: 'down', gap: 16.1, gapCluster: 23.1 },
  { indicatoreId: 'amb-02', valoreEnte: 1.2, mediaCluster: 2.1, trend: 'stable', gap: -33.3, gapCluster: -42.9 },
  { indicatoreId: 'amb-03', valoreEnte: 48, mediaCluster: 30, trend: 'up', gap: 41.2, gapCluster: 60.0 },
  { indicatoreId: 'amb-04', valoreEnte: 28, mediaCluster: 20, trend: 'stable', gap: 27.3, gapCluster: 40.0 },
  { indicatoreId: 'amb-05', valoreEnte: 0.51, mediaCluster: 0.40, trend: 'down', gap: 18.6, gapCluster: 27.5 },
  { indicatoreId: 'amb-06', valoreEnte: 11.3, mediaCluster: 10.8, trend: 'up', gap: 18.7, gapCluster: 4.6 },

  // Cultura
  { indicatoreId: 'cul-01', valoreEnte: 3.1, mediaCluster: 2.8, trend: 'up', gap: 34.8, gapCluster: 10.7 },
  { indicatoreId: 'cul-02', valoreEnte: 52.1, mediaCluster: 48.0, trend: 'up', gap: 15.3, gapCluster: 8.5 },
  { indicatoreId: 'cul-03', valoreEnte: 28.0, mediaCluster: 35.0, trend: 'down', gap: -13.8, gapCluster: -20.0 },
  { indicatoreId: 'cul-04', valoreEnte: 0.9, mediaCluster: 1.1, trend: 'stable', gap: -25.0, gapCluster: -18.2 },

  // Economia
  { indicatoreId: 'eco-01', valoreEnte: 61.5, mediaCluster: 62.0, trend: 'up', gap: 5.7, gapCluster: -0.8 },
  { indicatoreId: 'eco-02', valoreEnte: 20.1, mediaCluster: 18.5, trend: 'down', gap: -15.2, gapCluster: 8.6 },
  { indicatoreId: 'eco-03', valoreEnte: 23100, mediaCluster: 23800, trend: 'stable', gap: 7.9, gapCluster: -2.9 },
  { indicatoreId: 'eco-04', valoreEnte: 92.1, mediaCluster: 90.5, trend: 'up', gap: 8.0, gapCluster: 1.8 },
  { indicatoreId: 'eco-05', valoreEnte: 16.8, mediaCluster: 15.2, trend: 'stable', gap: -11.6, gapCluster: 10.5 },

  // Governance
  { indicatoreId: 'gov-01', valoreEnte: 75.3, mediaCluster: 76.0, trend: 'up', gap: 3.9, gapCluster: -0.9 },
  { indicatoreId: 'gov-02', valoreEnte: 110, mediaCluster: 135, trend: 'stable', gap: -24.1, gapCluster: -18.5 },
  { indicatoreId: 'gov-03', valoreEnte: 38.0, mediaCluster: 52.0, trend: 'up', gap: -21.3, gapCluster: -26.9 },
  { indicatoreId: 'gov-04', valoreEnte: 42, mediaCluster: 32, trend: 'stable', gap: 20.0, gapCluster: 31.3 },

  // Istruzione
  { indicatoreId: 'ist-01', valoreEnte: 18.5, mediaCluster: 28.0, trend: 'down', gap: -29.7, gapCluster: -33.9 },
  { indicatoreId: 'ist-02', valoreEnte: 19.0, mediaCluster: 29.0, trend: 'stable', gap: -30.1, gapCluster: -34.5 },
  { indicatoreId: 'ist-03', valoreEnte: 21.0, mediaCluster: 50.0, trend: 'stable', gap: -29.0, gapCluster: -29.0 },
  { indicatoreId: 'ist-04', valoreEnte: 15.2, mediaCluster: 11.0, trend: 'up', gap: 19.7, gapCluster: 38.2 },
  { indicatoreId: 'ist-05', valoreEnte: 155, mediaCluster: 195, trend: 'down', gap: -21.7, gapCluster: -20.5 },

  // Mobilità
  { indicatoreId: 'mob-01', valoreEnte: 2.1, mediaCluster: 4.2, trend: 'stable', gap: -44.7, gapCluster: -50.0 },
  { indicatoreId: 'mob-02', valoreEnte: 5.1, mediaCluster: 3.9, trend: 'stable', gap: 21.4, gapCluster: 30.8 },
  { indicatoreId: 'mob-03', valoreEnte: 58.0, mediaCluster: 65.0, trend: 'up', gap: -6.5, gapCluster: -10.8 },
  { indicatoreId: 'mob-04', valoreEnte: 12.5, mediaCluster: 11.2, trend: 'stable', gap: 5.9, gapCluster: 11.6 },

  // Popolazione
  { indicatoreId: 'pop-01', valoreEnte: 205.0, mediaCluster: 182.0, trend: 'up', gap: 9.3, gapCluster: 12.6 },
  { indicatoreId: 'pop-02', valoreEnte: 59.1, mediaCluster: 54.8, trend: 'up', gap: 5.0, gapCluster: 7.8 },
  { indicatoreId: 'pop-03', valoreEnte: 5.8, mediaCluster: 7.0, trend: 'down', gap: -13.4, gapCluster: -17.1 },
  { indicatoreId: 'pop-04', valoreEnte: 0.5, mediaCluster: 1.5, trend: 'down', gap: -58.3, gapCluster: -66.7 },
]

/* ── Helper: identifica le inefficienze (indicatori dove l'ente performa peggio del cluster) ── */

export interface Inefficienza {
  indicatoreId: string
  categoriaId: string
  nomeIndicatore: string
  valoreEnte: number
  mediaCluster: number
  gapCluster: number
  severita: 'critica' | 'alta' | 'media'
}

// Indicatori dove un valore ALTO è negativo (da invertire nel calcolo gap)
const INDICATORI_INVERSI = new Set([
  'amb-01', 'amb-03', 'amb-04', 'amb-05',
  'eco-02', 'eco-05',
  'gov-04',
  'ist-04',
  'mob-02', 'mob-04',
  'pop-01', 'pop-02',
])

export function calcolaInefficienze(): Inefficienza[] {
  // import inline per evitare circular deps

  const inefficienze: Inefficienza[] = []

  for (const v of VALORI_ENTE) {
    const isInverso = INDICATORI_INVERSI.has(v.indicatoreId)
    const performaPeggio = isInverso
      ? v.valoreEnte > v.mediaCluster
      : v.valoreEnte < v.mediaCluster

    if (!performaPeggio) continue

    const gapAbs = Math.abs(v.gapCluster)
    if (gapAbs < 5) continue // soglia minima per considerarla inefficienza

    let categoriaId = ''
    let nomeIndicatore = ''
    for (const cat of CATEGORIE) {
      const ind = cat.indicatori.find((i: { id: string }) => i.id === v.indicatoreId)
      if (ind) {
        categoriaId = cat.id
        nomeIndicatore = ind.nome
        break
      }
    }

    inefficienze.push({
      indicatoreId: v.indicatoreId,
      categoriaId,
      nomeIndicatore,
      valoreEnte: v.valoreEnte,
      mediaCluster: v.mediaCluster,
      gapCluster: v.gapCluster,
      severita: gapAbs > 25 ? 'critica' : gapAbs > 15 ? 'alta' : 'media',
    })
  }

  return inefficienze.sort((a, b) => Math.abs(b.gapCluster) - Math.abs(a.gapCluster))
}