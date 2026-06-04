export interface Project {
  id: string
  name: string
  cup: string
  capex: number
  opex_annuo: number
  orizzonte: number
  provincia: string
  settore: string
  vane: number
  tire: number
  bc: number
  payback: number
  pil: number
  occupazione: number
  produzione: number
  redditi: number
}

export * from './docfap'
export * from './incroci'

