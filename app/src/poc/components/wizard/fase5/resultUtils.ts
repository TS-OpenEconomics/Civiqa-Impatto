// src/components/wizard/fase5/resultUtils.ts
import type { CSSProperties } from 'react'
import type { AlternativaId, ScoreComposito } from '../../../types/docfap'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { RANK_COLORS, rankColor } from '../../docfap/rankColors'

// ── Formatters ──────────────────────────────────────────────────────────────

export function fmt1(v: number): string { return v.toFixed(1) }
export function fmt2(v: number): string { return v.toFixed(2) }
export function fmtEur(v: number): string {
  return v.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}
export function fmtPct(v: number): string { return `${v.toFixed(1)}%` }

// ── Label alternativa ───────────────────────────────────────────────────────

const TIPOLOGIA_LABELS: Record<string, string> = {
  nuova_realizzazione: 'Nuova realizzazione',
  ristrutturazione: 'Ristrutturazione',
  ristrutturazione_efficientamento: 'Ristrutturazione con EE',
  manutenzione_straordinaria_ee: 'Manutenzione straordinaria EE',
  manutenzione_ordinaria: 'Manutenzione ordinaria',
  restauro: 'Restauro',
  recupero: 'Recupero',
  ampliamento_potenziamento: 'Ampliamento / potenziamento',
  ammodernamento_tecnologico: 'Ammodernamento tecnologico',
  demolizione: 'Demolizione',
  lavori_socialmente_utili: 'Lavori socialmente utili',
  altro: 'Altro',
}

function toTitleCase(str: string): string {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

const catLabelMap: Record<string, string> = {}
for (const cat of INTERVENTION_CATEGORIES) {
  catLabelMap[cat.code] = cat.label
}

export function getAltLabel(
  altId: AlternativaId,
  alt: { categoria?: string; tipologia?: string; nome?: string } | null | undefined,
): string {
  if (!alt) return altId === 'A0' ? 'Opzione zero / Scenario di inerzia' : `Alternativa ${altId}`
  const rawCat = alt.categoria?.trim() ?? ''
  const rawTip = alt.tipologia?.trim() ?? ''
  if (rawCat || rawTip) {
    const catLabel = catLabelMap[rawCat] ? toTitleCase(catLabelMap[rawCat]) : rawCat ? toTitleCase(rawCat) : ''
    const tipLabel = TIPOLOGIA_LABELS[rawTip] ?? (rawTip ? toTitleCase(rawTip) : '')
    if (catLabel && tipLabel) return `${catLabel} — ${tipLabel}`
    if (catLabel) return catLabel
    if (tipLabel) return tipLabel
  }
  const nome = alt.nome?.trim() ?? ''
  if (nome) return nome
  return altId === 'A0' ? 'Opzione zero / Scenario di inerzia' : `Alternativa ${altId}`
}

// ── Colori chart ────────────────────────────────────────────────────────────
// Colore per piazzamento (rank): 1ª = verde, 2ª = arancione (solo con 3+
// opzioni), restanti = grigio. `rankIndex` 0 = migliore; `total` = numero di
// opzioni confrontate (serve a decidere se la 2ª va arancione o grigia).

export function getRankFill(rankIndex: number, total: number): string {
  return rankColor(rankIndex, total).solid
}

// ── Normalizzazione per grafici di dettaglio ────────────────────────────────
// Porta valori eterogenei (VAN €, PIL €M, ecc.) in scala 0-100 per display

export function normalizeValues(values: number[]): number[] {
  const positives = values.filter(v => v > 0)
  const max = positives.length > 0 ? Math.max(...positives) : 1
  return values.map(v => Math.round(Math.max(0, (v / max) * 100)))
}

// ── Stile celle tabella (usato in CbaPanel, RischioPanel, ImpattoPanel, SensitivitaPanel) ──

export function getInnerBodyCellStyle(
  item: ScoreComposito,
  recommendedId: AlternativaId | null,
): CSSProperties {
  return {
    padding: 'var(--spacing-inset-s)',
    borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
    borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
    color: 'var(--color-text-primary)',
    background: item.alternativaId === recommendedId
      ? RANK_COLORS.green.tint
      : 'var(--color-background-inverse)',
    fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
    textAlign: 'right',
  }
}

export function getInnerTotalCellStyle(
  item: ScoreComposito,
  recommendedId: AlternativaId | null,
): CSSProperties {
  return {
    padding: 'var(--spacing-inset-s)',
    borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
    borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
    background: item.alternativaId === recommendedId ? RANK_COLORS.green.tintStrong : 'rgba(120,120,130,0.10)',
    color: item.alternativaId === recommendedId
      ? RANK_COLORS.green.solid
      : 'var(--color-text-primary)',
    textAlign: 'right',
    fontWeight: 700,
    fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
  }
}

export const innerTableWrapStyle: CSSProperties = {
  overflowX: 'auto',
}

export const innerTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'var(--color-background-inverse)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
}

export const innerLabelHeaderCellStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '2px solid var(--color-background-primary, #5B21F7)',
  background: 'var(--color-background-secondary-lighter, #f1f1f1)',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
  width: '200px',
}

export const innerAltHeaderCellStyle: CSSProperties = {
  textAlign: 'right',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '2px solid var(--color-background-primary, #5B21F7)',
  borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  background: 'var(--color-background-secondary-lighter, #f1f1f1)',
  color: 'var(--color-text-primary)',
  fontWeight: 700,
  wordBreak: 'break-word',
}

export const innerAltHeaderRecommendedStyle: CSSProperties = {
  background: RANK_COLORS.green.solid,
  color: RANK_COLORS.green.text,
}

export const innerRowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  color: 'var(--color-text-primary)',
  fontWeight: 400,
}

export const innerTotalRowHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  background: RANK_COLORS.green.tint,
  color: RANK_COLORS.green.solid,
  fontWeight: 700,
}

export const innerRowAlternateStyle: CSSProperties = {
  background: 'var(--color-background-secondary-lighter, #f1f1f1)',
}

export const metaTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--type-body-xs-size, 13px)',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  padding: 'var(--spacing-inset-s)',
}

export const hintTextStyle: CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 400,
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  marginTop: '2px',
}

export const monoStyle: CSSProperties = {
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
}
