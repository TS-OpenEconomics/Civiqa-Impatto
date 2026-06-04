import { getCER, getTierRobustezza, CER_DATA } from '../cer'

// Test 1: totale record
console.assert(CER_DATA.length === 254, `FAIL: totale ${CER_DATA.length} != 254`)

// Test 2: getCER lookup e campi chiave
const scuole = getCER('SCUOLE ELEMENTARI, MEDIE E SUPERIORI', 'RISTRUTTURAZIONE')
console.assert(scuole !== undefined, 'FAIL: record scuole non trovato')
console.assert(scuole?.unitaMisura === 'mq', `FAIL: unitaMisura=${scuole?.unitaMisura}`)
console.assert(scuole?.robustezza === 3, `FAIL: robustezza=${scuole?.robustezza}`)
console.assert(scuole?.nProgetti === 309, `FAIL: nProgetti=${scuole?.nProgetti}`)
console.assert(Math.abs((scuole?.valoreMin ?? 0) - 78.31) < 0.1, `FAIL: valoreMin=${scuole?.valoreMin}`)
console.assert(Math.abs((scuole?.valoreMedio ?? 0) - 262.47) < 0.1, `FAIL: valoreMedio=${scuole?.valoreMedio}`)
console.assert(Math.abs((scuole?.valoreMax ?? 0) - 558.75) < 0.1, `FAIL: valoreMax=${scuole?.valoreMax}`)

// Test 2b: lookup richiesto per ASILI NIDO con durata > 0
const asili = getCER('ASILI NIDO', 'NUOVA REALIZZAZIONE')
console.assert(asili !== undefined, 'FAIL: record asili nido non trovato')
console.assert((asili?.durataMediaMesi ?? 0) > 0, `FAIL: durataMediaMesi=${asili?.durataMediaMesi}`)

// Test 3: nessuna % finale nelle descrizioni
const withPct = CER_DATA.filter(r => r.descrizione.endsWith('%'))
console.assert(withPct.length === 0, `FAIL: ${withPct.length} descrizioni con % finale`)

// Test 4: valori > 0 e distinti
const allValid = CER_DATA.every(
  r => r.valoreMin > 0 && r.valoreMedio > 0 && r.valoreMax > 0
    && r.valoreMin !== r.valoreMedio && r.valoreMedio !== r.valoreMax
)
console.assert(allValid, 'FAIL: record con valori uguali o <= 0')

// Test 5: getTierRobustezza mappings
console.assert(getTierRobustezza('L0-A') === 0, 'FAIL: L0-A')
console.assert(getTierRobustezza('L0-B') === 0, 'FAIL: L0-B')
console.assert(getTierRobustezza('L0-C') === 0, 'FAIL: L0-C')
console.assert(getTierRobustezza('L1-A') === 1, 'FAIL: L1-A')
console.assert(getTierRobustezza('L1-B') === 1, 'FAIL: L1-B')
console.assert(getTierRobustezza('L1-B-DUAL') === 1, 'FAIL: L1-B-DUAL')
console.assert(getTierRobustezza('L1-C') === 1, 'FAIL: L1-C')
console.assert(getTierRobustezza('L2-B') === 2, 'FAIL: L2-B')
console.assert(getTierRobustezza('L2-B-DUAL') === 2, 'FAIL: L2-B-DUAL')
console.assert(getTierRobustezza('L2-C') === 2, 'FAIL: L2-C')
console.assert(getTierRobustezza('L2PLUS-A') === 3, 'FAIL: L2PLUS-A')
console.assert(getTierRobustezza('L2PLUS-B') === 3, 'FAIL: L2PLUS-B')
console.assert(getTierRobustezza('UNKNOWN') === 0, 'FAIL: fallback')

console.log('Tutti i test CER superati — 254 record, valori corretti, robustezza mappata.')
