'use client'
import React from 'react'
import { format } from 'date-fns'
import { cn } from '@/utilities/ui'
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

const statusColors = {
  upcoming: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  current: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  completed: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600',
}

const statusLabels = {
  upcoming: 'Upcoming',
  current: 'Current', 
  completed: 'Completed',
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
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter internships based on status and search
  const filteredInternships = React.useMemo(() => {
    let filtered = internships

    // Filter by status
    if (showStatus !== 'all') {
      filtered = filtered.filter(intern => intern.status === showStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(intern =>
        intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.studyProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (intern.department && intern.department.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort internships
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

  // Pagination
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

  // Export functions
  const exportToCSV = () => {
    const headers = [
      'Name',
      'School',
      'Faculty', 
      'Study Program',
      'Start Date',
      'End Date',
      'Status',
      'Department',
      'Supervisor',
      'Contact Email',
      'Contact Phone',
      'Rating'
    ]

    const csvData = filteredInternships.map(intern => [
      intern.name,
      intern.school,
      intern.faculty,
      intern.studyProgram,
      format(new Date(intern.startDate), 'yyyy-MM-dd'),
      format(new Date(intern.endDate), 'yyyy-MM-dd'),
      statusLabels[intern.status],
      intern.department || '',
      intern.supervisor || '',
      intern.contactEmail || '',
      intern.contactPhone || '',
      intern.rating || ''
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `internships_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = async () => {
    // Dynamic import to avoid SSR issues
    const XLSX = await import('xlsx')
    
    const workbook = XLSX.utils.book_new()
    
    const worksheetData = [
      [
        'Name',
        'School',
        'Faculty',
        'Study Program', 
        'Start Date',
        'End Date',
        'Status',
        'Department',
        'Supervisor',
        'Contact Email',
        'Contact Phone',
        'Rating'
      ],
      ...filteredInternships.map(intern => [
        intern.name,
        intern.school,
        intern.faculty,
        intern.studyProgram,
        format(new Date(intern.startDate), 'yyyy-MM-dd'),
        format(new Date(intern.endDate), 'yyyy-MM-dd'),
        statusLabels[intern.status],
        intern.department || '',
        intern.supervisor || '',
        intern.contactEmail || '',
        intern.contactPhone || '',
        intern.rating || ''
      ])
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Internships')
    XLSX.writeFile(workbook, `internships_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  const SortIcon = ({ field }: { field: keyof Internship }) => (
    <span className="ml-1 text-gray-400">
      {sortField === field ? (
        sortDirection === 'asc' ? '↑' : '↓'
      ) : (
        '↕'
      )}
    </span>
  )

  // Mobile Card View
  const MobileCard = ({ intern }: { intern: Internship }) => {
    const acceptanceLink = getAcceptanceLetterLink(intern)
    
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 transition-colors duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{intern.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{intern.school}</p>
          </div>
          <span className={cn(
            'inline-flex px-2 py-1 text-xs font-semibold rounded-full border',
            statusColors[intern.status]
          )}>
            {statusLabels[intern.status]}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Faculty</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{intern.faculty}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Program</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{intern.studyProgram}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{format(new Date(intern.startDate), 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">End Date</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{format(new Date(intern.endDate), 'MMM dd, yyyy')}</p>
          </div>
        </div>

        {acceptanceLink && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <a
              href={acceptanceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 underline text-sm"
            >
              View Acceptance Letter
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with search and export */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Internships</h2>
          {showSearch && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search interns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
                {filteredInternships.length} of {internships.length} interns
              </span>
            </div>
          )}
        </div>
        
        {showExport && (
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={exportToCSV}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-200"
            >
              Export CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-200"
            >
              Export Excel
            </button>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-4">
          {paginatedInternships.map((intern) => (
            <MobileCard key={intern.id} intern={intern} />
          ))}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 transition-colors duration-200">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('name')}
                >
                  Name <SortIcon field="name" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('school')}
                >
                  School <SortIcon field="school" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('faculty')}
                >
                  Faculty <SortIcon field="faculty" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('studyProgram')}
                >
                  Study Program <SortIcon field="studyProgram" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('startDate')}
                >
                  Start Date <SortIcon field="startDate" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('endDate')}
                >
                  End Date <SortIcon field="endDate" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleSort('status')}
                >
                  Status <SortIcon field="status" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acceptance Letter
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedInternships.map((intern) => {
                const acceptanceLink = getAcceptanceLetterLink(intern)
                return (
                  <tr key={intern.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{intern.name}</div>
                      {intern.contactEmail && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{intern.contactEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {intern.school}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {intern.faculty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {intern.studyProgram}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(new Date(intern.startDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(new Date(intern.endDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full border',
                        statusColors[intern.status]
                      )}>
                        {statusLabels[intern.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {acceptanceLink ? (
                        <a
                          href={acceptanceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 underline transition-colors duration-200"
                        >
                          View Letter
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Not available</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {filteredInternships.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchTerm ? 'No interns found matching your search.' : 'No interns found.'}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInternships.length)} of {filteredInternships.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'px-3 py-1 border rounded-md transition-colors duration-200',
                    currentPage === page
                      ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}