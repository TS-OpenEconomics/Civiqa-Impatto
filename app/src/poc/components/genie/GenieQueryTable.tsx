import type { ReactElement } from 'react'
import type { QueryResult } from '../../services/genieService'

const MAX_ROWS = 100

interface GenieQueryTableProps {
  result: QueryResult
}

export function GenieQueryTable({ result }: GenieQueryTableProps): ReactElement | null {
  const columns = result?.manifest?.schema?.columns?.map(col => col.name) ?? []
  const allRows = result?.result?.data_array ?? []
  const rows = allRows.slice(0, MAX_ROWS)
  const hasOverflow = (result?.row_count ?? 0) > MAX_ROWS

  if (columns.length === 0) return null

  return (
    <>
      <div className="genie-query-table-wrapper">
        <table
          className="genie-query-table"
          aria-label="Risultati della query"
        >
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} scope="col">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={col}>{row[colIndex] ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasOverflow && (
        <p className="genie-query-table-overflow" role="note">
          Visualizzate le prime {MAX_ROWS} righe su {result.row_count} totali.
        </p>
      )}
    </>
  )
}
