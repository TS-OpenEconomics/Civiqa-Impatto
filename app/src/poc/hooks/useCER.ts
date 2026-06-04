import { useMemo } from 'react'
import { getCER } from '../data/cer'
import type { CerRecord } from '../types/docfap'

export function useCER(categoria: string, tipologia: string): CerRecord | undefined {
  return useMemo(() => {
    if (!categoria || !tipologia) return undefined
    return getCER(categoria, tipologia)
  }, [categoria, tipologia])
}
