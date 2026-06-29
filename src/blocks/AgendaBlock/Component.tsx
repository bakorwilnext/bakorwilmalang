'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { X, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react'

interface AgendaItem {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
}

interface AgendaBlockProps {
  title?: string
  limit?: number
  disableInnerContainer?: boolean
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const MONTH_SHORT_ID = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES',
]

const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const DISPLAY_LIMIT = 6

function createSafeDate(dateInput: string | Date): Date | null {
  try {
    if (!dateInput) return null
    const date = new Date(dateInput)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

function formatTime(dateStr: string): string {
  const date = createSafeDate(dateStr)
  if (!date) return ''
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatFullDate(dateStr: string): string {
  const date = createSafeDate(dateStr)
  if (!date) return ''
  return `${DAY_NAMES_ID[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`
}

const AgendaBlock: React.FC<AgendaBlockProps> = ({
  limit = DISPLAY_LIMIT,
  disableInnerContainer = false,
}) => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<AgendaItem | null>(null)

  useEffect(() => {
    let mounted = true

    fetch('/api/agenda?limit=1000&depth=0')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!mounted) return
        const valid = (data.docs || [])
          .filter((item: AgendaItem) => createSafeDate(item.startDate))
          .sort(
            (a: AgendaItem, b: AgendaItem) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
        setAgendaItems(valid)
      })
      .catch((err) => console.error('Failed to fetch agenda:', err))
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const upcoming = agendaItems.filter((item) => {
      const date = createSafeDate(item.startDate)
      return date ? date.getTime() >= now.getTime() : false
    })
                                                 
    if (upcoming.length === 0) return agendaItems.slice(-limit)
    return upcoming.slice(0, limit)
  }, [agendaItems, limit])

  const containerClass = `w-full mx-auto py-16 ${!disableInnerContainer ? 'container px-4' : ''}`
                    
  if (loading) {
    return (
      <section className={containerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-xl p-6 animate-pulse">
                <div className="flex gap-5">
                  <div className="w-[72px] h-[84px] bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
               
  if (upcomingEvents.length === 0) {
    return (
      <section className={containerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          <div className="text-center py-16 rounded-xl border border-gray-100 dark:border-gray-700">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada agenda mendatang</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Agenda akan ditampilkan di sini saat tersedia
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className={containerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />                                  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <AgendaCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
                                
          <div className="flex justify-center mt-10">
            <a
              href="/agenda"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-500 dark:text-cyan-400 hover:underline underline-offset-4 decoration-2 transition-all duration-200"
            >
              Lihat Semua Agenda
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  )
}
                           

function SectionHeader() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        Agenda
      </h2>
      <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
        Jadwal kegiatan dan acara resmi Bakorwil III Malang
      </p>
    </div>
  )
}

function AgendaCard({ event, onClick }: { event: AgendaItem; onClick: () => void }) {
  const date = createSafeDate(event.startDate)
  if (!date) return null

  const time = formatTime(event.startDate)
  const endTime = event.endDate ? formatTime(event.endDate) : null

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="p-5 sm:p-6 flex gap-5">                        
        <div className="flex-shrink-0 w-[72px] h-[84px] bg-cyan-500 group-hover:bg-cyan-600 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 shadow-sm">
          <span className="text-2xl font-bold text-white leading-none">
            {String(date.getDate()).padStart(2, '0')}
          </span>
          <span className="text-[11px] font-semibold text-cyan-100 uppercase tracking-wider mt-1">
            {MONTH_SHORT_ID[date.getMonth()]}
          </span>
          <span className="text-[10px] text-cyan-200 leading-none mt-0.5">
            {date.getFullYear()}
          </span>
        </div>
                      
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {time && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span>{time}{endTime && ` – ${endTime}`}</span>
            </div>
          )}

          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-200">
            {event.title}
          </h3>

          {event.location && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-cyan-500 dark:text-cyan-400" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="flex items-center text-xs font-medium text-cyan-500 dark:text-cyan-400 mt-2.5 group-hover:translate-x-1 transition-transform duration-200">
            <span className="group-hover:underline underline-offset-2">Selengkapnya</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>
    </button>
  )
}

function EventModal({ event, onClose }: { event: AgendaItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            <Calendar className="w-3.5 h-3.5" />
            {formatFullDate(event.startDate)}
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight pr-8">
            {event.title}
          </h2>
        </div>
                       
        <div className="px-6 pb-6">
          {event.description && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm">
              {event.description}
            </p>
          )}

          <div className="space-y-3">
            <InfoRow
              icon={<Clock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />}
              label="Waktu"
              value={`${formatTime(event.startDate)}${event.endDate ? ` – ${formatTime(event.endDate)}` : ''}`}
            />
            {event.location && (
              <InfoRow
                icon={<MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />}
                label="Lokasi"
                value={event.location}
              />
            )}
          </div>
        </div>
                    
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-xl transition-colors duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="w-9 h-9 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</div>
      </div>
    </div>
  )
}

export default AgendaBlock