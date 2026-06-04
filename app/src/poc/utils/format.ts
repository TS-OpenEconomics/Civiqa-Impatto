export function formatEuro(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
// Output: 50.000 (non 50000)

export function formatEuroFull(value: number): string {
  return '€ ' + formatEuro(value)
}
// Output: € 50.000
