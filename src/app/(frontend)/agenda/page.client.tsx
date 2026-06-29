'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { X, MapPin, Clock, Calendar, ChevronRight, Search, ChevronLeft } from 'lucide-react'

interface AgendaItem {
  id: string
  title: string
  description?: string | null
  startDate: string
  endDate?: string | null
  location?: string | null
}

interface AgendaPageClientProps {
  items: AgendaItem[]
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const MONTH_SHORT_ID = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES',
]

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
]

const ITEMS_PER_PAGE = 12

export default function AgendaPageClient({ items }: AgendaPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTime, setFilterTime] = useState<'all' | 'upcoming' | 'past'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<AgendaItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  const createSafeDate = useCallback((dateInput: string | Date): Date | null => {
    try {
      if (!dateInput) return null
      const date = new Date(dateInput)
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }, [])

  const formatTime = useCallback(
    (dateStr: string) => {
      const date = createSafeDate(dateStr)
      if (!date) return ''
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    },
    [createSafeDate],
  )

  const formatFullDate = useCallback(
    (dateStr: string) => {
      const date = createSafeDate(dateStr)
      if (!date) return ''
      return `${DAY_NAMES_ID[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`
    },
    [createSafeDate],
  )

  // Filter & search
  const filteredItems = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return items.filter((item) => {
      const date = createSafeDate(item.startDate)
      if (!date) return false

      // Time filter
      if (filterTime === 'upcoming' && date.getTime() < now.getTime()) return false
      if (filterTime === 'past' && date.getTime() >= now.getTime()) return false

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = item.title?.toLowerCase().includes(q)
        const matchLocation = item.location?.toLowerCase().includes(q)
        const matchDesc = item.description?.toLowerCase().includes(q)
        if (!matchTitle && !matchLocation && !matchDesc) return false
      }

      return true
    })
  }, [items, filterTime, searchQuery, createSafeDate])

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  const handleFilterChange = (filter: 'all' | 'upcoming' | 'past') => {
    setFilterTime(filter)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleEventClick = useCallback((event: AgendaItem) => {
    setSelectedEvent(event)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setSelectedEvent(null)
  }, [])

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari agenda..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-colors text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {([
            { key: 'all', label: 'Semua' },
            { key: 'upcoming', label: 'Mendatang' },
            { key: 'past', label: 'Selesai' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                filterTime === key
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Menampilkan {paginatedItems.length} dari {filteredItems.length} agenda
      </div>

      {paginatedItems.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Tidak ada agenda ditemukan
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((event) => {
            const date = createSafeDate(event.startDate)
            if (!date) return null

            const day = date.getDate()
            const monthShort = MONTH_SHORT_ID[date.getMonth()]
            const year = date.getFullYear()
            const time = formatTime(event.startDate)
            const endTime = event.endDate ? formatTime(event.endDate) : null
            const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0)

            return (
              <button
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="group w-full text-left rounded-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="p-5 sm:p-6 flex gap-5">
                  <div
                    className={`flex-shrink-0 w-[72px] h-[84px] rounded-lg flex flex-col items-center justify-center transition-colors duration-300 shadow-sm ${
                      isPast
                        ? 'bg-gray-400 group-hover:bg-gray-500'
                        : 'bg-cyan-500 group-hover:bg-cyan-600'
                    }`}
                  >
                    <span className="text-2xl font-bold text-white leading-none">
                      {String(day).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${
                        isPast ? 'text-gray-200' : 'text-cyan-100'
                      }`}
                    >
                      {monthShort}
                    </span>
                    <span
                      className={`text-[10px] leading-none mt-0.5 ${
                        isPast ? 'text-gray-300' : 'text-cyan-200'
                      }`}
                    >
                      {year}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Time */}
                    {time && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                        <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span>
                          {time}
                          {endTime && ` – ${endTime}`}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-200">
                      {event.title}
                    </h3>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-cyan-500 dark:text-cyan-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {/* Read more link */}
                    <div className="flex items-center text-xs font-medium text-cyan-500 dark:text-cyan-400 mt-2.5 group-hover:translate-x-1 transition-transform duration-200">
                      <span className="group-hover:underline underline-offset-2">Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Event Detail Modal */}
      {showModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Date Badge */}
              {(() => {
                const date = createSafeDate(selectedEvent.startDate)
                if (!date) return null
                return (
                  <div className="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatFullDate(selectedEvent.startDate)}
                  </div>
                )
              })()}

              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight pr-8">
                {selectedEvent.title}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6">
              {selectedEvent.description && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm">
                  {selectedEvent.description}
                </p>
              )}

              <div className="space-y-3">
                {/* Time */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-9 h-9 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Waktu</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(selectedEvent.startDate)}
                      {selectedEvent.endDate && ` – ${formatTime(selectedEvent.endDate)}`}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-9 h-9 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Lokasi</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={closeModal}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-xl transition-colors duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
