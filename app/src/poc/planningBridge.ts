/* ══════════════════════════════════════════════════════════════
   planningBridge.ts — Ponte tra Pianificazione e DOCFAP
   Memorizza temporaneamente i dati selezionati in Pianificazione
   per pre-compilare il DOCFAP
   ══════════════════════════════════════════════════════════════ */

interface BridgeData {
  projectIds: string[]
  progettoRiferimento: string
  fabbisognoNome: string
  categoriaId: string
}

let bridgeData: BridgeData | null = null

export function setBridgeData(data: BridgeData) {
  bridgeData = data
}

export function getBridgeData(): BridgeData | null {
  return bridgeData
}

export function clearBridgeData() {
  bridgeData = null
}

export function hasBridgeData(): boolean {
  return bridgeData !== null
}