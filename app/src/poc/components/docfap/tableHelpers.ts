import type { CSSProperties } from 'react'
import { INTERVENTION_CATEGORIES } from '../../data/poc_docfap/intervention_categories_layer3'
import type { AlternativaData, AlternativaId } from '../../types/docfap'
import type { ScoreComposito } from '../../types/docfap'

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
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function getAlternativeDisplayLabel(
  alternativaId: AlternativaId,
  alternativa: AlternativaData | null | undefined,
): string {
  const rawCat = alternativa?.categoria?.trim() ?? ''
  const rawTip = alternativa?.tipologia?.trim() ?? ''

  if (rawCat || rawTip) {
    const catRecord = INTERVENTION_CATEGORIES.find((c) => c.code === rawCat)
    const catLabel = catRecord ? toTitleCase(catRecord.label) : rawCat ? toTitleCase(rawCat) : ''
    const tipLabel = TIPOLOGIA_LABELS[rawTip] ?? (rawTip ? toTitleCase(rawTip) : '')

    if (catLabel && tipLabel) return `${catLabel} — ${tipLabel}`
    if (catLabel) return catLabel
    if (tipLabel) return tipLabel
  }

  const nome = alternativa?.nome?.trim() ?? ''
  if (nome) return nome

  if (alternativaId === 'A0') return 'Opzione zero / Scenario di inerzia'
  return `Alternativa ${alternativaId}`
}

export function getRecommendedAlternativeId<T extends { alternativaId: AlternativaId; scoreFinale: number }>(
  scores: T[],
): AlternativaId | null {
  if (scores.length === 0) return null
  return scores.reduce((best, current) => (
    safeNumber(current.scoreFinale, Number.NEGATIVE_INFINITY) > safeNumber(best.scoreFinale, Number.NEGATIVE_INFINITY)
      ? current
      : best
  )).alternativaId
}

export function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function formatScore(value: unknown): string {
  return safeNumber(value).toFixed(1)
}

export function hasRenderableDocfapScores(scores: ScoreComposito[] | null | undefined): boolean {
  if (!scores || scores.length === 0) return false

  const requiredKeys: Array<keyof ScoreComposito> = [
    'cbaScore',
    'van',
    'bcr',
    'tir',
    'impattoScore',
    'rischioScore',
    'sensitivityScore',
    'scoreComposito',
    'mcaScore',
    'scoreFinale',
    'pil',
    'occupati',
    'produzione',
    'redditi',
  ]

  return scores.every((score) => (
    Boolean(score?.alternativaId) &&
    requiredKeys.every((key) => Number.isFinite(score[key]))
  ))
}

export function getAlternativeColumnWidth(totalAlternatives: number): string {
  return `calc((100% - 180px) / ${Math.max(totalAlternatives, 1)})`
}

export const labelColumnStyle: CSSProperties = {
  width: '180px',
  minWidth: '180px',
}

export function alternativeColumnStyle(totalAlternatives: number): CSSProperties {
  return {
    width: getAlternativeColumnWidth(totalAlternatives),
    minWidth: '120px',
  }
}

export const detailHeaderCellBaseStyle: CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  verticalAlign: 'middle',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  wordBreak: 'break-word',
  fontSize: '12px',
  lineHeight: 1.25,
}

export const detailRecommendedHeaderStyle: CSSProperties = {
  // rgba translucido così l'evidenziazione funziona su tema chiaro e scuro
  background: 'rgba(91,33,247,0.08)',
  boxShadow: 'inset 3px 0 0 #7c4dff',
  color: 'var(--color-text-primary)',
}

export const detailHeaderLabelWrapStyle: CSSProperties = {
  display: 'grid',
  gap: '6px',
}

export const detailHeaderLabelStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: 1.25,
}

export const detailAltHeaderContentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
}

export const detailAltBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flex: '0 0 24px',
  background: 'var(--color-background-secondary-lightest)',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-0, monospace)',
  fontSize: 10,
  fontWeight: 800,
  lineHeight: 1,
}

export const detailRecommendedAltBadgeStyle: CSSProperties = {
  ...detailAltBadgeStyle,
  background: '#5b21f7',
  color: '#fff',
}

export const detailRecommendedBadgeStyle: CSSProperties = {
  display: 'inline-block',
  width: 'fit-content',
  padding: '2px 6px',
  borderRadius: 0,
  background: '#108a43',
  color: '#fff',
  fontSize: '9px',
  fontWeight: 700,
  lineHeight: 1.2,
  textTransform: 'uppercase',
}

export const detailRowHeaderStyle: CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  color: 'var(--color-text-primary)',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: 1.25,
}

export const detailBodyCellStyle: CSSProperties = {
  padding: '8px 12px',
  textAlign: 'right',
  borderBottom: '1px solid var(--color-border-secondary-light)',
  fontFamily: 'var(--font-family-0, monospace)',
  fontSize: '13px',
  lineHeight: '1.2',
}

export const detailRecommendedColumnStyle: CSSProperties = {
  background: 'rgba(91,33,247,0.05)',
}

export const detailBestCellStyle: CSSProperties = {
  background: 'rgba(16,138,67,0.10)',
  boxShadow: 'inset 3px 0 0 #108a43',
  color: 'var(--color-text-primary)',
  fontWeight: 800,
}

export const detailFinalRowHeaderStyle: CSSProperties = {
  ...detailRowHeaderStyle,
  background: 'rgba(91,33,247,0.08)',
  fontWeight: 700,
}

export const detailFinalCellStyle: CSSProperties = {
  ...detailBodyCellStyle,
  background: 'rgba(91,33,247,0.08)',
  fontWeight: 700,
}

export const detailEmptyStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary-light)',
}

/**
 * Filtra scoreFinale per includere solo le alternative definite dall'utente.
 * Usa sempre questo invece di leggere state.scoreFinale direttamente nei tab,
 * così i dati in cache non mostrano alternative obsolete.
 */
export function getDefinedScores(
  scoreFinale: ScoreComposito[] | null | undefined,
  alternativeDefinite: AlternativaId[],
): ScoreComposito[] {
  if (!scoreFinale || scoreFinale.length === 0) return []
  const defined = new Set(alternativeDefinite)
  return scoreFinale.filter((s) => defined.has(s.alternativaId))
}

/** Stile cella punteggio finale per la colonna raccomandata — sfondo più intenso + box-shadow (skin app). */
export function getDetailFinalRecommendedCellStyle(isRecommended: boolean): CSSProperties {
  if (!isRecommended) return detailFinalCellStyle
  return {
    ...detailFinalCellStyle,
    background: 'rgba(91,33,247,0.12)',
    boxShadow: 'inset 3px 0 0 #7c4dff',
  }
}

/** Wrapper tabella con bordo e border-radius (skin app). */
export const detailTableWrapStyle: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 4,
}
