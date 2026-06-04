export function getProjectYears(startDate: string, endDate: string): number[] {
  if (!startDate || !endDate) return []

  const startParts = startDate.split('/')
  const endParts = endDate.split('/')
  if (startParts.length !== 3 || endParts.length !== 3) return []

  const startYear = parseInt(startParts[2], 10)
  const endYear = parseInt(endParts[2], 10)
  if (isNaN(startYear) || isNaN(endYear) || endYear < startYear) return []

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
}

export function getOperationalYears(endDate: string, usefulLifeYears = 25): number[] {
  if (!endDate) return []

  const parts = endDate.split('/')
  if (parts.length !== 3) return []

  const endYear = parseInt(parts[2], 10)
  if (isNaN(endYear)) return []

  return Array.from({ length: usefulLifeYears }, (_, index) => endYear + index + 1)
}
