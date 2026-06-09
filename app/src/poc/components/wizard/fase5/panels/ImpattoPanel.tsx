// src/components/wizard/fase5/panels/ImpattoPanel.tsx
import type { CSSProperties } from 'react'
import type { AlternativaId, ScoreComposito } from '../../../../types/docfap'
import { Badge } from '../../../ui/Badge'
import {
  fmt1,
  getInnerBodyCellStyle, getInnerTotalCellStyle,
  innerTableWrapStyle, innerTableStyle,
  innerLabelHeaderCellStyle, innerAltHeaderCellStyle, innerAltHeaderRecommendedStyle,
  innerRowHeaderStyle, innerTotalRowHeaderStyle, innerRowAlternateStyle,
  monoStyle,
} from '../resultUtils'

interface Props {
  localRanking: ScoreComposito[]
  localRecommendedId: AlternativaId | null
  getLabel: (id: AlternativaId) => string
}

export function ImpattoPanel({ localRanking, localRecommendedId, getLabel }: Props) {
  const altLabelStyle: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 700, wordBreak: 'break-word', marginBottom: '4px' }

  return (
    <div role="tabpanel" id="result-panel-impatto" aria-labelledby="result-sw-impatto" style={panelStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Analisi d'Impatto</span>
          <span style={cardSubStyle}>PIL · Occupazione · Produzione · Redditi per alternativa</span>
        </div>
        <div style={innerTableWrapStyle}>
          <table style={innerTableStyle}>
            <colgroup>
              <col style={{ width: '200px' }} />
              {localRanking.map(item => <col key={item.alternativaId} />)}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" style={innerLabelHeaderCellStyle}>Indicatore</th>
                {localRanking.map(item => {
                  const isRec = item.alternativaId === localRecommendedId
                  return (
                    <th
                      key={item.alternativaId}
                      scope="col"
                      style={{ ...innerAltHeaderCellStyle, ...(isRec ? innerAltHeaderRecommendedStyle : null) }}
                    >
                      <span style={altLabelStyle}>{getLabel(item.alternativaId)}</span>
                      {isRec && <Badge label="Raccomandata" variant="success" size="s" />}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={innerRowHeaderStyle}>PIL (€M)</th>
                {localRanking.map(item => (
                  <td key={`pil-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmt1(item.pil)}</span>
                  </td>
                ))}
              </tr>
              <tr style={innerRowAlternateStyle}>
                <th scope="row" style={innerRowHeaderStyle}>Occupati</th>
                {localRanking.map(item => (
                  <td key={`occ-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{item.occupati.toLocaleString('it-IT')}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" style={innerRowHeaderStyle}>Produzione (€M)</th>
                {localRanking.map(item => (
                  <td key={`prod-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmt1(item.produzione)}</span>
                  </td>
                ))}
              </tr>
              <tr style={innerRowAlternateStyle}>
                <th scope="row" style={innerRowHeaderStyle}>Redditi (€M)</th>
                {localRanking.map(item => (
                  <td key={`red-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmt1(item.redditi)}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" style={innerTotalRowHeaderStyle}>Punteggio Analisi d'Impatto</th>
                {localRanking.map(item => (
                  <td key={`impscore-${item.alternativaId}`} style={getInnerTotalCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmt1(item.impattoScore)}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const panelStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px' }
const cardStyle: CSSProperties = { background: 'var(--color-background-inverse)', border: '1px solid var(--color-border-secondary-light, #e7e7e7)', borderRadius: 'var(--radius-smooth)', overflow: 'hidden' }
const cardHeaderStyle: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)', display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }
const cardTitleStyle: CSSProperties = { fontSize: '14px', fontWeight: 700 }
const cardSubStyle: CSSProperties = { fontSize: '11px', color: 'var(--color-text-primary-lighter, #6e6e6e)' }
