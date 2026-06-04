function roundDuration(value: number | null | undefined): number {
  return Math.round(Number(value) || 0)
}

export function getDurataDisplayValue(durataMediaMesi: number | null | undefined): string {
  const rounded = roundDuration(durataMediaMesi)
  return rounded > 0 ? `${rounded} mesi` : 'Non disponibile'
}

export function getInitialDurataInputValue(
  durataStimata: number | null | undefined,
  durataMediaMesi: number | null | undefined,
): string {
  const explicit = roundDuration(durataStimata)
  if (explicit > 0) return String(explicit)

  const estimated = roundDuration(durataMediaMesi)
  return estimated > 0 ? String(estimated) : ''
}

export function normalizeDurataOnBlur(
  rawValue: string,
  durataMediaMesi: number | null | undefined,
): { durataStimata: number | null; inputValue: string } {
  const parsed = Number(rawValue.trim())
  if (Number.isFinite(parsed) && parsed > 0) {
    const rounded = Math.round(parsed)
    return { durataStimata: rounded, inputValue: String(rounded) }
  }

  const estimated = roundDuration(durataMediaMesi)
  if (estimated > 0) {
    return { durataStimata: estimated, inputValue: String(estimated) }
  }

  return { durataStimata: null, inputValue: '' }
}
