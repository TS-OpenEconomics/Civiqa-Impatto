// Schema colori per ranking delle alternative del DOCFAP (wizard + risultati +
// grafici). Sostituisce il vecchio schema viola "raccomandata":
//   1ª (raccomandata / migliore) → VERDE
//   2ª (second best)             → ARANCIONE, solo con 3+ opzioni
//   restanti / 2ª con 2 opzioni  → GRIGIO
import type { AlternativaId } from '../../types/docfap'

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export type RankColorKey = 'green' | 'orange' | 'grey'

export interface RankColor {
  /** Riempimento pieno: badge "A1/A2…", barre dei grafici. */
  solid: string
  /** Testo su sfondo `solid`. */
  text: string
  /** Accento per contorni / bordi (3px inset, bordo card). */
  accent: string
  /** Tinta tenue per lo sfondo di colonne/celle. */
  tint: string
  /** Tinta più marcata per celle totale / punteggio finale. */
  tintStrong: string
}

export const RANK_COLORS: Record<RankColorKey, RankColor> = {
  green: {
    solid: '#108a43',
    text: '#ffffff',
    accent: '#138a43',
    tint: 'rgba(16, 138, 67, 0.08)',
    tintStrong: 'rgba(16, 138, 67, 0.18)',
  },
  orange: {
    solid: '#e07c00',
    text: '#ffffff',
    accent: '#e07c00',
    tint: 'rgba(224, 124, 0, 0.10)',
    tintStrong: 'rgba(224, 124, 0, 0.20)',
  },
  grey: {
    solid: '#8a8a92',
    text: '#ffffff',
    accent: '#b8b8c0',
    tint: 'rgba(120, 120, 130, 0.06)',
    tintStrong: 'rgba(120, 120, 130, 0.12)',
  },
}

/** 1°=verde, 2°=arancione (solo con 3+ opzioni), resto=grigio. */
export function rankColorKey(rankIndex: number, totalOptions: number): RankColorKey {
  if (rankIndex <= 0) return 'green'
  if (rankIndex === 1 && totalOptions >= 3) return 'orange'
  return 'grey'
}

export function rankColor(rankIndex: number, totalOptions: number): RankColor {
  return RANK_COLORS[rankColorKey(rankIndex, totalOptions)]
}

/**
 * Mappa alternativaId → indice di rank (0 = migliore) ordinando per scoreFinale
 * decrescente. Usala nelle tabelle/grafici per colorare ogni opzione in base al
 * suo piazzamento, non alla posizione naturale (A1/A2/…).
 */
export function buildRankIndexMap<T extends { alternativaId: AlternativaId; scoreFinale: number }>(
  scores: T[],
): Record<string, number> {
  const sorted = [...scores].sort(
    (a, b) => num(b.scoreFinale, Number.NEGATIVE_INFINITY) - num(a.scoreFinale, Number.NEGATIVE_INFINITY),
  )
  const map: Record<string, number> = {}
  sorted.forEach((s, i) => {
    map[s.alternativaId] = i
  })
  return map
}
