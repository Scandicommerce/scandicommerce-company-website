import type { TableBlock as TableBlockType } from '@/lib/blogBuilder'

interface DataTableProps {
  title?: string | null
  columns: (string | null)[]
  rows: (string | null)[][]
}

/** Hairline data table: ink-50 header row, 15px cells, scrolls sideways on narrow screens. */
export function DataTable({ title, columns, rows }: DataTableProps) {
  const cols = columns.filter((c): c is string => c != null && c !== '')
  if (cols.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      {title && <h3 className="m-0 text-[18px] font-bold leading-snug text-sc-ink-900">{title}</h3>}
      <div className="overflow-x-auto rounded-lg border border-sc-ink-100">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="bg-sc-ink-50">
              {cols.map((col, i) => (
                <th key={i} className="border-b border-sc-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-sc-ink-500">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, rowIndex) => (
              <tr key={rowIndex} className="border-b border-sc-ink-100 last:border-b-0">
                {cols.map((_, colIndex) => (
                  <td key={colIndex} className={`px-4 py-3 align-top text-[15px] leading-relaxed ${colIndex === 0 ? 'font-semibold text-sc-ink-900' : 'text-sc-ink-700'}`}>
                    {cells[colIndex] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TableBlockProps {
  block: TableBlockType
}

export default function TableBlock({ block }: TableBlockProps) {
  const columns = block.columns ?? []
  const rows = (block.rows ?? []).filter((r): r is { cells?: (string | null)[] | null } => r != null && 'cells' in r).map((r) => (Array.isArray(r.cells) ? r.cells : []))
  return <DataTable title={block.title} columns={columns} rows={rows} />
}
