'use client'
import React from 'react'
import type { Internship } from '@/payload-types'

interface InternshipAnalyticsProps {
  internships: Internship[]
  className?: string
}

interface AnalyticsData {
  totalInterns: number
  currentInterns: number
  upcomingInterns: number
  completedInterns: number
  averageRating: number
  topSchools: { school: string; count: number }[]
  topFaculties: { faculty: string; count: number }[]
  monthlyData: { month: string; started: number; completed: number }[]
  departmentDistribution: { department: string; count: number }[]
  averageDuration: number
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
  const analytics = React.useMemo((): AnalyticsData => {
    const totalInterns = internships.length
    const currentInterns = internships.filter(i => i.status === 'current').length
    const upcomingInterns = internships.filter(i => i.status === 'upcoming').length
    const completedInterns = internships.filter(i => i.status === 'completed').length

    const ratedInterns = internships.filter(i => i.rating && i.rating > 0)
    const averageRating = ratedInterns.length > 0
      ? ratedInterns.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedInterns.length
      : 0

    const schoolCounts = internships.reduce((acc, intern) => {
      acc[intern.school] = (acc[intern.school] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topSchools = Object.entries(schoolCounts)
      .map(([school, count]) => ({ school, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const facultyCounts = internships.reduce((acc, intern) => {
      acc[intern.faculty] = (acc[intern.faculty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topFaculties = Object.entries(facultyCounts)
      .map(([faculty, count]) => ({ faculty, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const now = new Date()
    const months: Date[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(d)
    }

    const monthlyData = months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999)

      const started = internships.filter(intern => {
        const sd = new Date(intern.startDate)
        return sd >= monthStart && sd <= monthEnd
      }).length

      const completed = internships.filter(intern => {
        const ed = new Date(intern.endDate)
        return ed >= monthStart && ed <= monthEnd
      }).length

      return {
        month: formatMonthYear(month),
        started,
        completed,
      }
    })

    const departmentCounts = internships.reduce((acc, intern) => {
      const dept = intern.department || 'Belum Ditentukan'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const departmentDistribution = Object.entries(departmentCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)

    const durations = internships.map(intern =>
      Math.round((new Date(intern.endDate).getTime() - new Date(intern.startDate).getTime()) / 86400000)
    )
    const averageDuration = durations.length > 0
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
      : 0

    return {
      totalInterns,
      currentInterns,
      upcomingInterns,
      completedInterns,
      averageRating,
      topSchools,
      topFaculties,
      monthlyData,
      departmentDistribution,
      averageDuration,
    }
  }, [internships])

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
      <div className="p-4 sm:p-6 border rounded-xl border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/20">
        <div className="mb-3">
          <h3 className="text-xs sm:text-sm font-medium text-cyan-900 dark:text-cyan-100 opacity-80">
            {title}
          </h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mb-1 text-cyan-900 dark:text-cyan-100">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs sm:text-sm text-cyan-900 dark:text-cyan-100 opacity-70">
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
    const maxValue = Math.max(...data.map(d => d.value))

    const maxLabelLength = Math.max(...data.map(d => d.label.length))
    const minLabelWidth = Math.max(120, maxLabelLength * 8)

    return (
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
        <h3 className="text-base sm:text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <div
                className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight flex-shrink-0"
                style={{ minWidth: `${minLabelWidth}px` }}
                title={item.label}
              >
                {item.label}
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-3 sm:h-4 relative overflow-hidden min-w-0">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 text-right flex-shrink-0 w-8">
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
    const maxValue = Math.max(
      ...data.flatMap(d => [d.started, d.completed])
    )

    return (
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
        <h3 className="text-base sm:text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <div className="flex items-end justify-between h-56 sm:h-64 gap-1 sm:gap-2 overflow-x-auto rounded-lg p-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-0">
              <div className="flex flex-col items-center justify-end h-44 sm:h-48 gap-1">
                <div
                  className="bg-cyan-500 w-4 sm:w-5 rounded-t-md transition-all duration-500 ease-out"
                  style={{
                    height: `${maxValue > 0 ? (item.started / maxValue) * 100 : 0}%`,
                    minHeight: item.started > 0 ? '8px' : '0px',
                  }}
                  title={`Mulai: ${item.started}`}
                />
                <div
                  className="bg-cyan-300 w-4 sm:w-5 rounded-t-md transition-all duration-500 ease-out"
                  style={{
                    height: `${maxValue > 0 ? (item.completed / maxValue) * 100 : 0}%`,
                    minHeight: item.completed > 0 ? '8px' : '0px',
                  }}
                  title={`Selesai: ${item.completed}`}
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 transform -rotate-45 origin-center whitespace-nowrap font-medium">
                {item.month}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Mulai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-300 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Selesai</span>
          </div>
        </div>
      </div>
    )
  }

  if (internships.length === 0) {
    return (
      <div className={`space-y-6 ${className ?? ''}`}>
        <div className="text-center py-16 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Belum ada data magang</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Analitik Magang
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Magang"
          value={analytics.totalInterns}
        />
        <StatCard
          title="Magang Aktif"
          value={analytics.currentInterns}
        />
        <StatCard
          title="Akan Datang"
          value={analytics.upcomingInterns}
        />
        <StatCard
          title="Selesai"
          value={analytics.completedInterns}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Rating Rata-rata"
          value={analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : 'N/A'}
          subtitle={analytics.averageRating > 0 ? 'Dari 5.0' : 'Belum ada rating'}
        />
        <StatCard
          title="Durasi Rata-rata"
          value={Math.round(analytics.averageDuration)}
          subtitle="Hari"
        />
        <StatCard
          title="Divisi Aktif"
          value={analytics.departmentDistribution.length}
          subtitle="Divisi berbeda"
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

          <div className="w-full">
            <BarChart
              data={analytics.departmentDistribution.map(d => ({ label: d.department, value: d.count }))}
              title="Distribusi Divisi"
            />
          </div>
        </>
      )}
    </div>
  )
}