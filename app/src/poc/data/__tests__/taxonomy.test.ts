import { CLUSTER_MCA } from '../mca/clusters'
import { FABBISOGNI } from '../taxonomy/fabbisogni'
import { LOOKUP } from '../taxonomy/lookup'

const getLookupRecord = (categoria: string, tipologia: string) => LOOKUP[`${categoria}||${tipologia}`]
const getFabbisogno = (fabId: string) => FABBISOGNI.find((f) => f.id === fabId)
const getCluster = (clusterId: string) => CLUSTER_MCA[clusterId]
const cleanRiskDescription = (descrizione: string) => descrizione.replace(/%$/, '').trim()
const parsePesoDefault = (pesoDefault: string) => parseFloat(pesoDefault.replace('%', '').trim())
// Test 1: lookup funziona con chiave corretta
const record = getLookupRecord('ASILI NIDO', 'AMPLIAMENTO O POTENZIAMENTO')
console.assert(record?.fabId === 'FAB-01', 'FAIL: lookup FAB-01')
console.assert(record?.clusterId === 'C03', 'FAIL: lookup cluster C03')

// Test 2: scenarioZero per-FAB non è generico
const fab = getFabbisogno('FAB-01')
console.assert((fab?.scenarioZero.q1Label.length ?? 0) > 0, 'FAIL: q1Label vuota')
console.assert(fab?.scenarioZero.q1Label !== fab?.scenarioZero.q2Label, 'FAIL: label identiche')

// Test 3: cluster C03 ha struttura completa
const cluster = getCluster('C03')
console.assert(cluster?.criteriiKO.length === 5, 'FAIL: KO non sono 5')
console.assert((cluster?.criteriiQualitativi.length ?? 0) > 0, 'FAIL: qualitative mancanti')
console.assert((cluster?.fattoriRischio.length ?? 0) > 0, 'FAIL: rischi mancanti')

// Test 4: bug % rimosso correttamente
const conBug = 'Presenza di reti interrate non mappate%'
console.assert(cleanRiskDescription(conBug) === 'Presenza di reti interrate non mappate', 'FAIL: % non rimossa')

// Test 5: parseFloat peso default
console.assert(parsePesoDefault('25%') === 25, 'FAIL: peso parsing')
console.assert(parsePesoDefault('10%') === 10, 'FAIL: peso parsing')

// Test 6: conteggi corretti
console.assert(FABBISOGNI.length === 32, `FAIL: FAB count ${FABBISOGNI.length} != 32`)
console.assert(Object.keys(CLUSTER_MCA).length === 13, `FAIL: cluster count`)
console.assert(Object.keys(LOOKUP).length === 576, `FAIL: lookup count`)

console.log('Tutti i smoke test superati — tassonomia pronta.')

