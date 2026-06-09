// src/components/wizard/fase5/panels/CbaPanel.tsx
import type { CSSProperties } from 'react'
import type { AlternativaId, ScoreComposito } from '../../../../types/docfap'
import { Badge } from '../../../ui/Badge'
import {
  fmt1, fmt2, fmtEur, fmtPct,
  getInnerBodyCellStyle, getInnerTotalCellStyle,
  innerTableWrapStyle, innerTableStyle,
  innerLabelHeaderCellStyle, innerAltHeaderCellStyle, innerAltHeaderRecommendedStyle,
  innerRowHeaderStyle, innerTotalRowHeaderStyle, innerRowAlternateStyle,
  monoStyle, metaTextStyle,
} from '../resultUtils'

interface Props {
  localRanking: ScoreComposito[]
  localRecommendedId: AlternativaId | null
  getLabel: (id: AlternativaId) => string
}

export function CbaPanel({ localRanking, localRecommendedId, getLabel }: Props) {
  if (localRanking.length === 0) return <p style={metaTextStyle}>Nessun dato disponibile.</p>

  return (
    <div role="tabpanel" id="result-panel-cba" aria-labelledby="result-sw-cba" style={panelStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Analisi Costi–Benefici</span>
          <span style={cardSubStyle}>
            Orizzonte: {localRanking[0].orizzonte} anni · Tasso sconto: {fmtPct(localRanking[0].tassoSconto * 100)}
          </span>
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
                <th scope="row" style={innerRowHeaderStyle}>VANE</th>
                {localRanking.map(item => (
                  <td key={`van-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmtEur(item.van)}</span>
                  </td>
                ))}
              </tr>
              <tr style={innerRowAlternateStyle}>
                <th scope="row" style={innerRowHeaderStyle}>TIRE</th>
                {localRanking.map(item => (
                  <td key={`tir-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmtPct(item.tir * 100)}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" style={innerRowHeaderStyle}>BCR</th>
                {localRanking.map(item => (
                  <td key={`bcr-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmt2(item.bcr)}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" style={innerTotalRowHeaderStyle}>Punteggio Analisi Costi Benefici</th>
                {localRanking.map(item => (
                  <td key={`cbascore-${item.alternativaId}`} style={getInnerTotalCellStyle(item, localRecommendedId)}>
                    <span style={monoStyle}>{fmt1(item.cbaScore)}</span>
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
const altLabelStyle: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 700, wordBreak: 'break-word', marginBottom: '4px' }
