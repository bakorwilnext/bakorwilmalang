import React from 'react'

interface Column {
  label: string
  type: 'text' | 'link'
}

interface Cell {
  value: string
  url?: string | null
}

interface Row {
  cells?: Cell[]
}

interface DocumentTableBlockProps {
  title?: string | null
  columns?: Column[]
  rows?: Row[]
  disableInnerContainer?: boolean
}

export const DocumentTableBlock: React.FC<DocumentTableBlockProps> = ({
  title,
  columns,
  rows,
  disableInnerContainer,
}) => {
  if (!columns || columns.length === 0 || !rows || rows.length === 0) return null

  return (
    <section className="py-16">
      <div className={`container mx-auto ${disableInnerContainer ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-8">
            {title}
          </h2>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-black shadow-xs">
          <table className="w-full border-collapse">
            <thead className="bg-slate-700 text-white border-b border-slate-600 text-xs uppercase tracking-wider font-semibold">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 sm:px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-black">
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => {
                    const cell = row.cells?.[colIdx]
                    if (!cell) {
                      return (
                        <td
                          key={colIdx}
                          className="px-4 sm:px-6 py-3.5 text-sm text-gray-400 dark:text-gray-500"
                        >
                          —
                        </td>
                      )
                    }

                    if (cell.url) {
                      return (
                        <td key={colIdx} className="px-4 sm:px-6 py-3.5">
                          <a
                            href={cell.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-500 dark:text-cyan-400 hover:underline underline-offset-4 decoration-2"
                          >
                            {cell.value}
                          </a>
                        </td>
                      )
                    }

                    return (
                      <td
                        key={colIdx}
                        className="px-4 sm:px-6 py-3.5 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {cell.value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
