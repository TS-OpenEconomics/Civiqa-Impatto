import { CATEGORIE_RELAZIONI } from '../data/taxonomy/categorie-relazioni'

export interface MOPSector {
  id: string
  label: string
}

export interface MOPSubSector {
  id: string
  label: string
}

export interface MOPCategory {
  id: string
  label: string
}

export interface InterventionType {
  id: string
  label: string
  description: string
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildSectorId(label: string): string {
  return `sector-${slugify(label)}`
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const DOCFAP_TAXONOMY = CATEGORIE_RELAZIONI.map((relation) => ({
  sectorId: relation.settoreId || buildSectorId(relation.settore),
  sectorLabel: relation.settore,
  subSectorId: relation.sottosettoreId,
  subSectorLabel: relation.sottosettore,
  categoryId: relation.categoriaId,
  categoryLabel: relation.categoria,
  interventionTypes: relation.tipologie.map((tipologia) => ({
    id: tipologia.id,
    label: tipologia.label,
    description: '',
  })),
}))

export function getSectors(): MOPSector[] {
  return uniqueById(
    DOCFAP_TAXONOMY.map((entry) => ({
      id: entry.sectorId,
      label: entry.sectorLabel,
    })),
  ).sort((left, right) => left.label.localeCompare(right.label, 'it-IT'))
}

export function getSubSectors(sectorId: string): MOPSubSector[] {
  return uniqueById(
    DOCFAP_TAXONOMY.filter((entry) => entry.sectorId === sectorId).map((entry) => ({
      id: entry.subSectorId,
      label: entry.subSectorLabel,
    })),
  ).sort((left, right) => left.label.localeCompare(right.label, 'it-IT'))
}

export function getCategories(sectorId: string, subSectorId: string): MOPCategory[] {
  return uniqueById(
    DOCFAP_TAXONOMY.filter((entry) => entry.sectorId === sectorId && entry.subSectorId === subSectorId).map(
      (entry) => ({
        id: entry.categoryId,
        label: entry.categoryLabel,
      }),
    ),
  ).sort((left, right) => left.label.localeCompare(right.label, 'it-IT'))
}

export function getInterventionTypes(
  sectorId: string,
  subSectorId: string,
  categoryId?: string | null,
): { type: InterventionType; suggested: boolean }[] {
  if (!categoryId) return []

  const entry = DOCFAP_TAXONOMY.find(
    (item) =>
      item.sectorId === sectorId && item.subSectorId === subSectorId && item.categoryId === categoryId,
  )

  if (!entry) return []

  return entry.interventionTypes
    .map((type) => ({ type, suggested: false }))
    .sort((left, right) => left.type.label.localeCompare(right.type.label, 'it-IT'))
}

export function getAllCategories(): Array<MOPCategory & { sectorId: string; subSectorId: string }> {
  return uniqueById(
    DOCFAP_TAXONOMY.map((entry) => ({
      id: entry.categoryId,
      label: entry.categoryLabel,
      sectorId: entry.sectorId,
      subSectorId: entry.subSectorId,
    })),
  )
}
