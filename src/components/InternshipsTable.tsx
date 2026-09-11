'use client'
import React from 'react'
import type { Internship, Media } from '@/payload-types'

interface InternshipsTableProps {
  internships: Internship[]
  className?: string
  showStatus?: 'all' | 'current' | 'upcoming' | 'completed'
  showSearch?: boolean
  showPagination?: boolean
  itemsPerPage?: number
  showExport?: boolean
}

const BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

const formatTanggal = (dateStr?: string | null) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
}

const statusColors = {
  upcoming: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200/70 dark:border-cyan-800/60',
  current: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60',
  completed: 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
}

const statusLabels = {
  upcoming: 'Akan Datang',
  current: 'Aktif',
  completed: 'Selesai',
}

export const getInternNim = (intern: Internship): string | null => {
  if (intern.nim && intern.nim.trim()) return intern.nim.trim()
  if (intern.notes) {
    const match = intern.notes.match(/^(?:NIM\/NIS|NIM|NIS):\s*(.+)$/i)
    if (match && match[1] && match[1].trim()) return match[1].trim()
    if (intern.notes.startsWith('NIM/NIS:')) {
      const val = intern.notes.replace(/^NIM\/NIS:\s*/i, '').trim()
      if (val) return val
    }
  }
  return null
}

export const InternshipsTable: React.FC<InternshipsTableProps> = ({
  internships,
  className,
  showStatus = 'all',
  showSearch = true,
  showPagination = true,
  itemsPerPage = 10,
  showExport = true,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortField, setSortField] = React.useState<keyof Internship>('startDate')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')

  const filteredInternships = React.useMemo(() => {
    let filtered = internships

    if (showStatus !== 'all') {
      filtered = filtered.filter(intern => intern.status === showStatus)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(intern => {
        const nim = getInternNim(intern)
        return (
          (intern.name && intern.name.toLowerCase().includes(term)) ||
          (nim && nim.toLowerCase().includes(term)) ||
          (intern.school && intern.school.toLowerCase().includes(term)) ||
          (intern.faculty && intern.faculty.toLowerCase().includes(term)) ||
          (intern.studyProgram && intern.studyProgram.toLowerCase().includes(term))
        )
      })
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [internships, showStatus, searchTerm, sortField, sortDirection])

  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInternships = filteredInternships.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Internship) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getAcceptanceLetterLink = (intern: Internship) => {
    if (intern.acceptanceLetter?.type === 'link') {
      return intern.acceptanceLetter.url
    } else if (intern.acceptanceLetter?.type === 'upload' && intern.acceptanceLetter.file) {
      const media = intern.acceptanceLetter.file as Media
      return media.url
    }
    return null
  }

  const exportToCSV = () => {
    const headers = [
      'Nama',
      'NIM/NIS',
      'Kampus',
      'Fakultas',
      'Prodi',
      'Mulai',
      'Selesai',
      'Status',
      'Supervisor',
      'Contact Email',
      'Contact Phone'
    ]

    const csvData = filteredInternships.map(intern => [
      intern.name || '',
      getInternNim(intern) || intern.nim || '',
      intern.school || '',
      intern.faculty || '',
      intern.studyProgram || '',
      intern.startDate ? new Date(intern.startDate).toISOString().slice(0, 10) : '',
      intern.endDate ? new Date(intern.endDate).toISOString().slice(0, 10) : '',
      statusLabels[intern.status] || intern.status || '',
      intern.supervisor || '',
      intern.contactEmail || '',
      intern.contactPhone || ''
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `internships_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = async () => {
    const XLSX = await import('xlsx')

    const workbook = XLSX.utils.book_new()

    const worksheetData = [
      [
        'Nama',
        'NIM/NIS',
        'Kampus',
        'Fakultas',
        'Prodi',
        'Mulai',
        'Selesai',
        'Status',
        'Supervisor',
        'Contact Email',
        'Contact Phone'
      ],
      ...filteredInternships.map(intern => [
        intern.name || '',
        getInternNim(intern) || intern.nim || '',
        intern.school || '',
        intern.faculty || '',
        intern.studyProgram || '',
        intern.startDate ? new Date(intern.startDate).toISOString().slice(0, 10) : '',
        intern.endDate ? new Date(intern.endDate).toISOString().slice(0, 10) : '',
        statusLabels[intern.status] || intern.status || '',
        intern.supervisor || '',
        intern.contactEmail || '',
        intern.contactPhone || ''
      ])
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Internships')
    XLSX.writeFile(workbook, `internships_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const SortIcon = ({ field }: { field: keyof Internship }) => (
    <span className="ml-1 text-gray-400">
      {sortField === field ? (
        sortDirection === 'asc' ? '\u2191' : '\u2193'
      ) : (
        '\u2195'
      )}
    </span>
  )

  const MobileCard = ({ intern }: { intern: Internship }) => {
    const acceptanceLink = getAcceptanceLetterLink(intern)
    const nim = getInternNim(intern)

    return (
      <div className="bg-white dark:bg-black border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 transition-colors duration-200 shadow-xs">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{intern.name}</h3>
            {nim && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{nim}</p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{intern.school || '—'}</p>
          </div>
          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[intern.status]}`}>
            {statusLabels[intern.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fakultas</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{intern.faculty || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Prodi</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{intern.studyProgram || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mulai</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{formatTanggal(intern.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Selesai</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{formatTanggal(intern.endDate)}</p>
          </div>
        </div>

        {acceptanceLink && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <a
              href={acceptanceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline text-sm font-medium"
            >
              Lihat Surat Penerimaan
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-4${className ? ` ${className}` : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
          {showSearch && (
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto items-stretch sm:items-center">
              <input
                type="text"
                placeholder="Cari nama, kampus, jurusan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 shadow-xs transition-all w-full sm:w-80 placeholder:text-slate-400"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 self-center">
                {filteredInternships.length} dari {internships.length} magang
              </span>
            </div>
          )}
        </div>

        {showExport && (
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={exportToCSV}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 dark:bg-black hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs"
            >
              Ekspor CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            >
              Ekspor Excel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 md:hidden">
        {paginatedInternships.map((intern) => (
          <MobileCard key={intern.id} intern={intern} />
        ))}
      </div>

      {/* Consolidated 5-column table that fits 100% width with NO horizontal scroll */}
      <div className="hidden md:block rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-black shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-slate-700 text-white border-b border-slate-600 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th
                className="w-[26%] px-5 py-3.5 cursor-pointer hover:text-cyan-300 hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('name')}
              >
                Mahasiswa <SortIcon field="name" />
              </th>
              <th
                className="w-[34%] px-5 py-3.5 cursor-pointer hover:text-cyan-300 hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('school')}
              >
                Instansi & Studi <SortIcon field="school" />
              </th>
              <th
                className="w-[20%] px-5 py-3.5 cursor-pointer hover:text-cyan-300 hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('startDate')}
              >
                Periode <SortIcon field="startDate" />
              </th>
              <th
                className="w-[10%] px-4 py-3.5 text-center cursor-pointer hover:text-cyan-300 hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </th>
              <th className="w-[10%] px-4 py-3.5 text-center">
                Berkas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-black">
            {paginatedInternships.map((intern) => {
              const acceptanceLink = getAcceptanceLetterLink(intern)
              const nim = getInternNim(intern)
              return (
                <tr key={intern.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors duration-150">
                  <td className="px-5 py-3.5 align-middle">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {intern.name}
                    </div>
                    {nim ? (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {nim}
                      </div>
                    ) : intern.contactEmail ? (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {intern.contactEmail}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 align-middle">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-200 leading-snug">
                      {intern.school || '—'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {(intern.studyProgram || intern.faculty) ? `${intern.studyProgram || ''}${intern.studyProgram && intern.faculty ? ' · ' : ''}${intern.faculty || ''}` : '—'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 align-middle">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {intern.startDate || intern.endDate ? `${formatTanggal(intern.startDate)} – ${formatTanggal(intern.endDate)}` : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 align-middle text-center">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusColors[intern.status]}`}>
                      {statusLabels[intern.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-middle text-center">
                    {acceptanceLink ? (
                      <a
                        href={acceptanceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-800/60 hover:bg-cyan-500 hover:text-white transition-all duration-150 active:scale-95 shadow-xs"
                      >
                        Surat
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredInternships.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchTerm ? 'Tidak ada data magang yang sesuai.' : 'Belum ada data magang.'}
        </div>
      )}

      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan {startIndex + 1} sampai {Math.min(startIndex + itemsPerPage, filteredInternships.length)} dari {filteredInternships.length} hasil
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-black text-slate-800 dark:text-slate-200 transition-colors duration-200 text-xs font-medium shadow-xs"
            >
              Sebelumnya
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-xl transition-colors duration-200 text-xs font-medium shadow-xs ${
                    currentPage === page
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-black text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-900 bg-white dark:bg-black text-slate-800 dark:text-slate-200 transition-colors duration-200 text-xs font-medium shadow-xs"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}