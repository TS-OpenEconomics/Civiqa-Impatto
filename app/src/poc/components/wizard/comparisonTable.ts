import type { AlternativaData, AlternativaId } from '../../types/docfap'

export function hasComparisonAlternativeData(alternativa: AlternativaData | null): boolean {
  if (!alternativa) return false
  return Boolean(
    alternativa.categoria ||
      alternativa.tipologia ||
      alternativa.nome ||
      (alternativa.quantita ?? 0) > 0,
  )
}

export function getComparisonAlternativeLabel(
  alternativaId: AlternativaId,
  alternativa: AlternativaData | null,
): string {
  const nome = alternativa?.nome?.trim() ?? ''
  if (nome) return nome

  if (alternativaId === 'A0') {
    return 'Opzione zero — Scenario di inerzia'
  }

  const categoria = (alternativa?.categoria ?? '').trim()
  const tipologia = (alternativa?.tipologia ?? '').trim()

  if (categoria && tipologia) return `${categoria.toUpperCase()} / ${tipologia.toUpperCase()}`
  if (categoria) return categoria.toUpperCase()
  if (tipologia) return tipologia.toUpperCase()

  return `Alternativa ${alternativaId}`
}

export function getComparisonColumnWidth(totalColumns: number): string {
  const safeColumns = Math.max(totalColumns, 1)
  return `${100 / safeColumns}%`
}
