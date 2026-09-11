'use client'
import React from 'react'
import type { Internship } from '@/payload-types'

interface InternshipAnalyticsProps {
  internships: Internship[]
  className?: string
}

interface AnalyticsData {
  totalInterns: number
  totalSchools: number
  totalPrograms: number
  averageDuration: number
  topSchools: { school: string; count: number }[]
  topFaculties: { faculty: string; count: number }[]
  monthlyData: { month: string; started: number; completed: number }[]
}

const INDONESIAN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

function formatMonthYear(date: Date): string {
  return `${INDONESIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export const InternshipAnalytics: React.FC<InternshipAnalyticsProps> = ({
  internships,
  className,
}) => {
  const [startDate, setStartDate] = React.useState<string>('')
  const [endDate, setEndDate] = React.useState<string>('')
  const [activePreset, setActivePreset] = React.useState<string>('all')

  const availableYears = React.useMemo(() => {
    const years = new Set<string>()
    internships.forEach(intern => {
      if (intern.startDate) {
        const y = intern.startDate.slice(0, 4)
        if (y && !isNaN(Number(y))) years.add(y)
      }
      if (intern.endDate) {
        const y = intern.endDate.slice(0, 4)
        if (y && !isNaN(Number(y))) years.add(y)
      }
    })
    return Array.from(years).sort((a, b) => Number(b) - Number(a))
  }, [internships])

  const handlePreset = (preset: string) => {
    setActivePreset(preset)
    if (preset === 'all') {
      setStartDate('')
      setEndDate('')
    } else {
      setStartDate(`${preset}-01-01`)
      setEndDate(`${preset}-12-31`)
    }
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setActivePreset('all')
  }

  const filteredInternships = React.useMemo(() => {
    if (!startDate && !endDate) return internships

    const filterStart = startDate ? new Date(startDate) : null
    const filterEnd = endDate ? new Date(`${endDate}T23:59:59.999Z`) : null

    return internships.filter(intern => {
      const s = intern.startDate ? new Date(intern.startDate) : null
      const e = intern.endDate ? new Date(intern.endDate) : null

      if (!s && !e) return false

      if (filterStart) {
        const internEnd = e || s
        if (internEnd && internEnd < filterStart) return false
      }

      if (filterEnd) {
        const internStart = s || e
        if (internStart && internStart > filterEnd) return false
      }

      return true
    })
  }, [internships, startDate, endDate])

  const analytics = React.useMemo((): AnalyticsData => {
    const totalInterns = filteredInternships.length

    const totalSchools = new Set(
      filteredInternships
        .map(i => (i.school ? i.school.trim() : ''))
        .filter(Boolean)
    ).size

    const totalPrograms = new Set(
      filteredInternships
        .map(i => (i.studyProgram ? i.studyProgram.trim() : ''))
        .filter(Boolean)
    ).size

    const schoolCounts = filteredInternships.reduce((acc, intern) => {
      const sch = intern.school ? intern.school.trim() : ''
      if (sch) {
        acc[sch] = (acc[sch] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    const topSchools = Object.entries(schoolCounts)
      .map(([school, count]) => ({ school, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const facultyCounts = filteredInternships.reduce((acc, intern) => {
      const fac = intern.faculty ? intern.faculty.trim() : ''
      if (fac) {
        acc[fac] = (acc[fac] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    const topFaculties = Object.entries(facultyCounts)
      .map(([faculty, count]) => ({ faculty, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Generate month range for the LineChart
    const months: Date[] = []
    const fStart = startDate ? new Date(startDate) : null
    const fEnd = endDate ? new Date(endDate) : null

    if (fStart && fEnd && fStart <= fEnd) {
      let cur = new Date(fStart.getFullYear(), fStart.getMonth(), 1)
      const endMonth = new Date(fEnd.getFullYear(), fEnd.getMonth(), 1)
      while (cur <= endMonth && months.length < 36) {
        months.push(new Date(cur))
        cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
      }
    } else if (fStart) {
      let cur = new Date(fStart.getFullYear(), fStart.getMonth(), 1)
      for (let i = 0; i < 12; i++) {
        months.push(new Date(cur))
        cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
      }
    } else if (fEnd) {
      for (let i = 11; i >= 0; i--) {
        months.push(new Date(fEnd.getFullYear(), fEnd.getMonth() - i, 1))
      }
    } else {
      const latestInternshipDate = filteredInternships.reduce((max, i) => {
        const d = i.startDate ? new Date(i.startDate) : null
        if (d && !isNaN(d.getTime()) && d > max) return d
        return max
      }, new Date(0))

      const anchorDate = latestInternshipDate.getTime() > 0 ? latestInternshipDate : new Date()
      for (let i = 11; i >= 0; i--) {
        months.push(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1))
      }
    }

    if (months.length === 0) {
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        months.push(new Date(now.getFullYear(), now.getMonth() - i, 1))
      }
    }

    const monthlyData = months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999)

      const started = filteredInternships.filter(intern => {
        if (!intern.startDate) return false
        const sd = new Date(intern.startDate)
        return !isNaN(sd.getTime()) && sd >= monthStart && sd <= monthEnd
      }).length

      const completed = filteredInternships.filter(intern => {
        if (!intern.endDate) return false
        const ed = new Date(intern.endDate)
        return !isNaN(ed.getTime()) && ed >= monthStart && ed <= monthEnd
      }).length

      return {
        month: formatMonthYear(month),
        started,
        completed,
      }
    })

    const validDurations = filteredInternships
      .filter(intern => intern.startDate && intern.endDate)
      .map(intern => {
        const start = intern.startDate ? new Date(intern.startDate).getTime() : NaN
        const end = intern.endDate ? new Date(intern.endDate).getTime() : NaN
        if (isNaN(start) || isNaN(end)) return 0
        return Math.round((end - start) / 86400000)
      })
      .filter(d => d > 0)

    const averageDuration = validDurations.length > 0
      ? validDurations.reduce((sum, duration) => sum + duration, 0) / validDurations.length
      : 0

    return {
      totalInterns,
      totalSchools,
      totalPrograms,
      averageDuration,
      topSchools,
      topFaculties,
      monthlyData,
    }
  }, [filteredInternships, startDate, endDate])

  const StatCard = ({
    title,
    value,
    subtitle,
  }: {
    title: string
    value: string | number
    subtitle?: string
  }) => {
    return (
      <div className="p-4 sm:p-5 border rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-black shadow-xs transition-colors">
        <div className="mb-2">
          <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mb-0.5 text-slate-900 dark:text-slate-100">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  const BarChart = ({
    data,
    title,
  }: {
    data: { label: string; value: number }[]
    title: string
  }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1)

    return (
      <div className="bg-white dark:bg-black p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Top {data.length}
          </span>
        </div>
        <div className="space-y-3.5">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight w-32 sm:w-44 md:w-56 shrink-0 truncate"
                title={item.label}
              >
                {item.label}
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-full h-3 relative overflow-hidden min-w-0">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 text-right shrink-0 w-8">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const LineChart = ({
    data,
    title,
  }: {
    data: { month: string; started: number; completed: number }[]
    title: string
  }) => {
    const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null)

    const rawMax = Math.max(...data.flatMap(d => [d.started, d.completed]), 0)
    const maxValue = rawMax === 0 ? 4 : Math.max(Math.ceil(rawMax * 1.25), 4)

    const totalStarted = data.reduce((sum, d) => sum + d.started, 0)
    const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0)

    // SVG coordinates
    const vbWidth = 800
    const vbHeight = 250
    const pad = { top: 24, right: 28, bottom: 42, left: 36 }
    const chartW = vbWidth - pad.left - pad.right
    const chartH = vbHeight - pad.top - pad.bottom
    const baseY = pad.top + chartH

    const numPoints = data.length
    const pointsStarted = data.map((d, i) => ({
      x: pad.left + (numPoints > 1 ? (i / (numPoints - 1)) * chartW : chartW / 2),
      y: pad.top + chartH - (d.started / maxValue) * chartH,
    }))

    const pointsCompleted = data.map((d, i) => ({
      x: pad.left + (numPoints > 1 ? (i / (numPoints - 1)) * chartW : chartW / 2),
      y: pad.top + chartH - (d.completed / maxValue) * chartH,
    }))

    const createSmoothPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return ''
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
      let path = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1]
        const curr = pts[i]
        const cp1x = prev.x + (curr.x - prev.x) / 2
        const cp1y = prev.y
        const cp2x = prev.x + (curr.x - prev.x) / 2
        const cp2y = curr.y
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
      }
      return path
    }

    const createAreaPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return ''
      const line = createSmoothPath(pts)
      return `${line} L ${pts[pts.length - 1].x} ${baseY} L ${pts[0].x} ${baseY} Z`
    }

    const linePathStarted = createSmoothPath(pointsStarted)
    const areaPathStarted = createAreaPath(pointsStarted)
    const linePathCompleted = createSmoothPath(pointsCompleted)
    const areaPathCompleted = createAreaPath(pointsCompleted)

    // Y ticks (4 levels)
    const yTicks = [0, 0.33, 0.66, 1].map(ratio => ({
      val: Math.round(ratio * maxValue),
      y: pad.top + chartH - ratio * chartH,
    }))

    const activeItem = hoveredIdx !== null ? data[hoveredIdx] : null

    return (
      <div className="bg-white dark:bg-black p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeItem ? (
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                  {activeItem.month}: {activeItem.started} Mulai, {activeItem.completed} Selesai
                </span>
              ) : (
                `12 bulan terakhir · Total: ${totalStarted} Mulai, ${totalCompleted} Selesai`
              )}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs font-medium self-start sm:self-auto">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 ring-2 ring-cyan-500/20"></span>
              <span className="text-slate-700 dark:text-slate-300">Mulai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
              <span className="text-slate-700 dark:text-slate-300">Selesai</span>
            </div>
          </div>
        </div>

        {/* 100% Responsive SVG Area/Line Chart - Zero Horizontal Scroll */}
        <div className="w-full relative select-none">
          <svg
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            className="w-full h-auto overflow-visible"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="gradStarted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Lines & Tick Labels */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={pad.left}
                  x2={vbWidth - pad.right}
                  y1={tick.y}
                  y2={tick.y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray={i === 0 ? '0' : '4 4'}
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="text-[11px] font-medium fill-slate-400 dark:fill-slate-500"
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* Area Fills */}
            <path d={areaPathStarted} fill="url(#gradStarted)" />
            <path d={areaPathCompleted} fill="url(#gradCompleted)" />

            {/* Line Strokes */}
            <path
              d={linePathStarted}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={linePathCompleted}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Vertical Guideline & Glowing Nodes */}
            {hoveredIdx !== null && (
              <g>
                <line
                  x1={pointsStarted[hoveredIdx].x}
                  x2={pointsStarted[hoveredIdx].x}
                  y1={pad.top}
                  y2={baseY}
                  stroke="currentColor"
                  className="text-cyan-500/60 dark:text-cyan-400/60"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
                {/* Glow & Dots for Mulai */}
                <circle
                  cx={pointsStarted[hoveredIdx].x}
                  cy={pointsStarted[hoveredIdx].y}
                  r="7"
                  fill="#06b6d4"
                  fillOpacity="0.25"
                />
                <circle
                  cx={pointsStarted[hoveredIdx].x}
                  cy={pointsStarted[hoveredIdx].y}
                  r="4"
                  fill="#ffffff"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />
                {/* Glow & Dots for Selesai */}
                <circle
                  cx={pointsCompleted[hoveredIdx].x}
                  cy={pointsCompleted[hoveredIdx].y}
                  r="7"
                  fill="#10b981"
                  fillOpacity="0.25"
                />
                <circle
                  cx={pointsCompleted[hoveredIdx].x}
                  cy={pointsCompleted[hoveredIdx].y}
                  r="4"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* X-Axis Month Labels */}
            {data.map((item, i) => {
              const x = pointsStarted[i].x
              const [monthName, year] = item.month.split(' ')
              const isHovered = hoveredIdx === i
              const step = data.length > 20 ? 3 : data.length > 12 ? 2 : 1
              const showLabel = i % step === 0 || i === data.length - 1 || isHovered
              if (!showLabel) return null

              return (
                <text
                  key={i}
                  x={x}
                  y={baseY + 22}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors cursor-pointer ${
                    isHovered
                      ? 'fill-cyan-600 dark:fill-cyan-400 font-bold'
                      : 'fill-slate-500 dark:fill-slate-400 font-medium'
                  }`}
                  onMouseEnter={() => setHoveredIdx(i)}
                >
                  {monthName}
                  {i === 0 || monthName === 'Jan' || data.length <= 6 ? (
                    <tspan className="text-[9px] fill-slate-400 dark:fill-slate-500 font-normal">
                      {' ' + (year?.slice(2) || '')}
                    </tspan>
                  ) : null}
                </text>
              )
            })}

            {/* Invisible hover trigger columns for easy cursor/touch tracking */}
            {data.map((_, i) => {
              const colW = chartW / numPoints
              const colX = pad.left + i * colW - colW / 2
              return (
                <rect
                  key={i}
                  x={Math.max(colX, pad.left)}
                  y={pad.top}
                  width={colW}
                  height={chartH + 30}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onTouchStart={() => setHoveredIdx(i)}
                />
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  if (internships.length === 0) {
    return (
      <div className={`space-y-6 ${className ?? ''}`}>
        <div className="text-center py-16 bg-cyan-50 dark:bg-black rounded-xl border border-cyan-200 dark:border-slate-800">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Belum ada data magang</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      {/* Date Range Filter Bar */}
      <div className="p-4 sm:p-5 border rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-black shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Filter Rentang Tanggal Visualisasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {startDate || endDate ? (
                  <>
                    Menampilkan <span className="font-semibold text-cyan-600 dark:text-cyan-400">{filteredInternships.length}</span> dari {internships.length} data magang
                    {startDate && ` • Dari ${startDate}`}
                    {endDate && ` • Sampai ${endDate}`}
                  </>
                ) : (
                  <>Menampilkan seluruh data (<span className="font-semibold text-cyan-600 dark:text-cyan-400">{internships.length}</span> magang)</>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Year Presets */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200/80 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => handlePreset('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activePreset === 'all'
                    ? 'bg-cyan-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Semua
              </button>
              {availableYears.slice(0, 4).map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handlePreset(year)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activePreset === year
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Custom Range Picker */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-xs">
                <span className="text-slate-400 font-medium text-[11px]">Mulai:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setActivePreset('custom')
                  }}
                  className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
                />
              </div>
              <span className="text-slate-400 font-bold hidden sm:inline">—</span>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-xs">
                <span className="text-slate-400 font-medium text-[11px]">Selesai:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setActivePreset('custom')
                  }}
                  className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
                />
              </div>

              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all font-medium flex items-center gap-1"
                  title="Reset filter tanggal"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {filteredInternships.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-black shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Tidak ada data magang dalam rentang tanggal ini
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Silakan pilih tahun lain atau klik tombol reset di bawah untuk melihat seluruh data.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all active:scale-95 shadow-xs"
          >
            Reset Filter Tanggal
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Magang"
              value={analytics.totalInterns}
              subtitle="Peserta terdaftar"
            />
            <StatCard
              title="Kampus Mitra"
              value={analytics.totalSchools}
              subtitle="Universitas & SMK"
            />
            <StatCard
              title="Program Studi"
              value={analytics.totalPrograms}
              subtitle="Jurusan keilmuan"
            />
            <StatCard
              title="Durasi Rata-rata"
              value={`${Math.round(analytics.averageDuration)} Hari`}
              subtitle={`~${(analytics.averageDuration / 30).toFixed(1)} bulan magang`}
            />
          </div>

          {analytics.totalInterns > 0 && (
            <>
              <div className="w-full">
                <LineChart
                  data={analytics.monthlyData}
                  title="Tren Magang Bulanan"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <BarChart
                  data={analytics.topSchools.map(s => ({ label: s.school, value: s.count }))}
                  title="Asal Kampus"
                />
                <BarChart
                  data={analytics.topFaculties.map(f => ({ label: f.faculty, value: f.count }))}
                  title="Fakultas"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}