import assert from 'node:assert/strict'
import {
  getDurataDisplayValue,
  getInitialDurataInputValue,
  normalizeDurataOnBlur,
} from './step3DurataStimata.logic.js'

assert.equal(getDurataDisplayValue(75.9), '76 mesi')
assert.equal(getDurataDisplayValue(0), 'Non disponibile')
assert.equal(getDurataDisplayValue(undefined), 'Non disponibile')

assert.equal(getInitialDurataInputValue(18, 75.9), '18')
assert.equal(getInitialDurataInputValue(null, 75.9), '76')
assert.equal(getInitialDurataInputValue(undefined, 0), '')

assert.deepEqual(normalizeDurataOnBlur('', 75.9), {
  durataStimata: 76,
  inputValue: '76',
})

assert.deepEqual(normalizeDurataOnBlur('', 0), {
  durataStimata: null,
  inputValue: '',
})

assert.deepEqual(normalizeDurataOnBlur('31', 75.9), {
  durataStimata: 31,
  inputValue: '31',
})

console.log('step3DurataStimata.logic.test.ts: ok')
