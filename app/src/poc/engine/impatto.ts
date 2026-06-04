import type { AlternativaData } from '../types/docfap'
import type { ClusterMCA } from '../types/incroci'

interface LocalizzazioneInput {
  comune?: string
  provincia?: string
  regione?: string
  zonaSismica?: string
  classificazioneArea?: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

function normalizeText(value: string | undefined): string {
  return (value ?? '')
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function parseZonaSismica(zonaSismica: string | undefined): 1 | 2 | 3 | 4 {
  const match = (zonaSismica ?? '').match(/[1-4]/)
  const value = match ? Number(match[0]) : 2
  if (value === 1 || value === 2 || value === 3 || value === 4) return value
  return 2
}

function countVincoliSignals(cluster: ClusterMCA): number {
  const pattern = /(vincol|paesagg|idrogeolog|tutela|soprintendenz|pai|ambient)/i
  const koSignals = cluster.criteriiKO.filter(
    (criterio) => pattern.test(criterio.criterio) || pattern.test(criterio.domanda),
  ).length
  const riskSignals = cluster.fattoriRischio.filter(
    (fattore) => pattern.test(fattore.fattore) || pattern.test(fattore.descrizione),
  ).length
  return koSignals + riskSignals
}

function calcSubScoreAmbientale(localizzazione: LocalizzazioneInput, cluster: ClusterMCA): number {
  const zona = parseZonaSismica(localizzazione.zonaSismica)
  const zonaScore: Record<1 | 2 | 3 | 4, number> = {
    1: 30,
    2: 50,
    3: 72,
    4: 88,
  }

  const vincoliSignals = countVincoliSignals(cluster)
  const vincoliScore = clamp(100 - vincoliSignals * 8, 36, 100)

  return zonaScore[zona] * 0.6 + vincoliScore * 0.4
}

function calcBacinoScore(alternativa: AlternativaData): number {
  const bacino = Math.max(0, alternativa.obiettivoCer ?? alternativa.quantita ?? 0)
  if (bacino >= 200000) return 95
  if (bacino >= 50000) return 80
  if (bacino >= 15000) return 65
  if (bacino > 0) return 48
  return 32
}

function calcCategoriaSocialeScore(alternativa: AlternativaData): number {
  const category = `${alternativa.categoria} ${alternativa.tipologia}`.toLocaleLowerCase('it-IT')
  if (/scuol|ospedal|sanitar|social|assistenzial|infanzia/.test(category)) return 90
  if (/mobilit|strad|ferrov|trasport/.test(category)) return 74
  if (/digit|telecom|energia/.test(category)) return 68
  return 60
}

function calcSubScoreSociale(alternativa: AlternativaData): number {
  const bacinoScore = calcBacinoScore(alternativa)
  const categoriaScore = calcCategoriaSocialeScore(alternativa)
  return bacinoScore * 0.65 + categoriaScore * 0.35
}

function calcClassificazioneAreaScore(classificazioneArea: string | undefined): number {
  const key = normalizeText(classificazioneArea)
  if (key.includes('snai')) return 84
  if (key.includes('metropolitan')) return 76
  if (key.includes('urbana media')) return 72
  if (key.includes('urbana piccola')) return 66
  if (key.includes('rurale') || key.includes('montana')) return 64
  return 68
}

function calcCatTipScore(alternativa: AlternativaData): number {
  const tipologia = normalizeText(alternativa.tipologia)
  if (tipologia.includes('manutenzione straordinaria con efficientamento energetico')) return 88
  if (tipologia.includes('ristrutturazione') || tipologia.includes('recupero')) return 82
  if (tipologia.includes('ampliamento') || tipologia.includes('potenziamento')) return 74
  if (tipologia.includes('nuova realizzazione')) return 62
  if (tipologia.includes('restauro')) return 79
  return 68
}

function calcSubScoreTerritoriale(
  alternativa: AlternativaData,
  localizzazione: LocalizzazioneInput,
): number {
  const areaScore = calcClassificazioneAreaScore(localizzazione.classificazioneArea)
  const catTipScore = calcCatTipScore(alternativa)
  return areaScore * 0.5 + catTipScore * 0.5
}

export interface ImpactBreakdown {
  ambientale: number
  sociale: number
  territoriale: number
  totale: number
}

export function calcImpactBreakdown(
  alternativa: AlternativaData,
  localizzazione: LocalizzazioneInput,
  cluster: ClusterMCA,
): ImpactBreakdown {
  const subAmbientale = calcSubScoreAmbientale(localizzazione, cluster)
  const subSociale = calcSubScoreSociale(alternativa)
  const subTerritoriale = calcSubScoreTerritoriale(alternativa, localizzazione)

  const weighted = subAmbientale * 0.35 + subSociale * 0.3 + subTerritoriale * 0.35
  return {
    ambientale: round1(clamp(subAmbientale, 0, 100)),
    sociale: round1(clamp(subSociale, 0, 100)),
    territoriale: round1(clamp(subTerritoriale, 0, 100)),
    totale: round1(clamp(weighted, 0, 100)),
  }
}

export function calcImpactScore(
  alternativa: AlternativaData,
  localizzazione: LocalizzazioneInput,
  cluster: ClusterMCA,
): number {
  return calcImpactBreakdown(alternativa, localizzazione, cluster).totale
}
