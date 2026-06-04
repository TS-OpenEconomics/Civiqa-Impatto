import type { FabbisognoCompleto } from '../../../types/incroci'

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('it-IT')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function simplifyToken(token: string): string {
  if (token.length <= 4) return token

  if (token.endsWith('i') || token.endsWith('e') || token.endsWith('o') || token.endsWith('a')) {
    return token.slice(0, -1)
  }

  return token
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(' ')
    .map((token) => simplifyToken(token))
    .filter((token) => token.length > 0)
}

export function matchesFabbisognoSearch(fab: FabbisognoCompleto, query: string): boolean {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return true

  const haystackTokens = tokenize(`${fab.label} ${fab.sottolabel}`)
  if (haystackTokens.length === 0) return false

  return queryTokens.every((queryToken) =>
    haystackTokens.some((haystackToken) =>
      haystackToken.startsWith(queryToken) || queryToken.startsWith(haystackToken),
    ),
  )
}
