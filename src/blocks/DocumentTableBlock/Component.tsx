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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-white bg-cyan-500 first:rounded-tl-lg last:rounded-tr-lg"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
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
