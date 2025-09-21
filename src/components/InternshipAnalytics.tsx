'use client'
import React from 'react'
import { format, differenceInDays, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { cn } from '@/utilities/ui'
import type { Internship } from '@/payload-types'

interface InternshipAnalyticsProps {
  internships: Internship[]
  className?: string
  showCharts?: boolean
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

export const InternshipAnalytics: React.FC<InternshipAnalyticsProps> = ({
  internships,
  className,
  showCharts = true,
}) => {
  const analytics = React.useMemo((): AnalyticsData => {
    const totalInterns = internships.length
    const currentInterns = internships.filter(i => i.status === 'current').length
    const upcomingInterns = internships.filter(i => i.status === 'upcoming').length
    const completedInterns = internships.filter(i => i.status === 'completed').length

    // Calculate average rating
    const ratedInterns = internships.filter(i => i.rating && i.rating > 0)
    const averageRating = ratedInterns.length > 0 
      ? ratedInterns.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedInterns.length 
      : 0

    // Top schools
    const schoolCounts = internships.reduce((acc, intern) => {
      acc[intern.school] = (acc[intern.school] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topSchools = Object.entries(schoolCounts)
      .map(([school, count]) => ({ school, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top faculties
    const facultyCounts = internships.reduce((acc, intern) => {
      acc[intern.faculty] = (acc[intern.faculty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topFaculties = Object.entries(facultyCounts)
      .map(([faculty, count]) => ({ faculty, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Monthly data for the last 12 months
    const endDate = new Date()
    const startDate = subMonths(endDate, 11)
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    
    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const started = internships.filter(intern => {
        const startDate = new Date(intern.startDate)
        return startDate >= monthStart && startDate <= monthEnd
      }).length

      const completed = internships.filter(intern => {
        const endDate = new Date(intern.endDate)
        return endDate >= monthStart && endDate <= monthEnd
      }).length

      return {
        month: format(month, 'MMM yyyy'),
        started,
        completed
      }
    })

    // Department distribution
    const departmentCounts = internships.reduce((acc, intern) => {
      const dept = intern.department || 'Unassigned'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const departmentDistribution = Object.entries(departmentCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)

    // Average duration
    const durations = internships.map(intern => 
      differenceInDays(new Date(intern.endDate), new Date(intern.startDate))
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
      averageDuration
    }
  }, [internships])

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    color = 'cyan',
    icon
  }: { 
    title: string
    value: string | number
    subtitle?: string
    color?: 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose' | 'blue'
    icon?: string
  }) => {
    const colorClasses = {
      cyan: {
        bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900',
        border: 'border-cyan-200 dark:border-cyan-800',
        text: 'text-cyan-900 dark:text-cyan-100',
        accent: 'text-cyan-600 dark:text-cyan-400'
      },
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-900 dark:text-emerald-100',
        accent: 'text-emerald-600 dark:text-emerald-400'
      },
      amber: {
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-900 dark:text-amber-100',
        accent: 'text-amber-600 dark:text-amber-400'
      },
      violet: {
        bg: 'bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900',
        border: 'border-violet-200 dark:border-violet-800',
        text: 'text-violet-900 dark:text-violet-100',
        accent: 'text-violet-600 dark:text-violet-400'
      },
      rose: {
        bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900',
        border: 'border-rose-200 dark:border-rose-800',
        text: 'text-rose-900 dark:text-rose-100',
        accent: 'text-rose-600 dark:text-rose-400'
      },
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-900 dark:text-blue-100',
        accent: 'text-blue-600 dark:text-blue-400'
      }
    }

    const classes = colorClasses[color]

    return (
      <div className={cn(
        'p-4 sm:p-6 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200',
        classes.bg,
        classes.border
      )}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn('text-xs sm:text-sm font-medium', classes.text, 'opacity-80')}>
            {title}
          </h3>
          {icon && (
            <span className={cn('text-lg sm:text-xl', classes.accent)}>
              {icon}
            </span>
          )}
        </div>
        <p className={cn('text-2xl sm:text-3xl font-bold mb-1', classes.text)}>
          {value}
        </p>
        {subtitle && (
          <p className={cn('text-xs sm:text-sm', classes.text, 'opacity-70')}>
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  const BarChart = ({ 
    data, 
    title,
    maxHeight = 100 
  }: { 
    data: { label: string; value: number }[]
    title: string
    maxHeight?: number
  }) => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    // Calculate the minimum width needed for the longest label
    const maxLabelLength = Math.max(...data.map(d => d.label.length))
    const minLabelWidth = Math.max(120, maxLabelLength * 8) // Base 120px or 8px per character
    
    return (
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <h3 className="text-base sm:text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></span>
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
                  className="bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ 
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` 
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
    title 
  }: { 
    data: { month: string; started: number; completed: number }[]
    title: string
  }) => {
    const maxValue = Math.max(
      ...data.flatMap(d => [d.started, d.completed])
    )

    return (
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <h3 className="text-base sm:text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></span>
          {title}
        </h3>
        <div className="flex items-end justify-between h-56 sm:h-64 gap-1 sm:gap-2 overflow-x-auto bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-800 rounded-lg p-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-0">
              <div className="flex flex-col items-center justify-end h-44 sm:h-48 gap-1">
                <div 
                  className="bg-gradient-to-t from-cyan-500 to-cyan-400 dark:from-cyan-600 dark:to-cyan-500 w-4 sm:w-5 rounded-t-md transition-all duration-500 ease-out shadow-sm"
                  style={{ 
                    height: `${maxValue > 0 ? (item.started / maxValue) * 100 : 0}%`,
                    minHeight: item.started > 0 ? '8px' : '0px'
                  }}
                  title={`Started: ${item.started}`}
                />
                <div 
                  className="bg-gradient-to-t from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500 w-4 sm:w-5 rounded-t-md transition-all duration-500 ease-out shadow-sm"
                  style={{ 
                    height: `${maxValue > 0 ? (item.completed / maxValue) * 100 : 0}%`,
                    minHeight: item.completed > 0 ? '8px' : '0px'
                  }}
                  title={`Completed: ${item.completed}`}
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
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Completed</span>
          </div>
        </div>
      </div>
    )
  }

  if (internships.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No internship data available</p>
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Add some internships to see analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Internship Analytics
        </h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Interns" 
          value={analytics.totalInterns}
          color="cyan"
          icon="👥"
        />
        <StatCard 
          title="Current Interns" 
          value={analytics.currentInterns}
          color="emerald"
          icon="🟢"
        />
        <StatCard 
          title="Upcoming Interns" 
          value={analytics.upcomingInterns}
          color="amber"
          icon="⏳"
        />
        <StatCard 
          title="Completed Interns" 
          value={analytics.completedInterns}
          color="violet"
          icon="✅"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard 
          title="Average Rating" 
          value={analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : 'N/A'}
          subtitle={analytics.averageRating > 0 ? 'Out of 5.0' : 'No ratings yet'}
          color="rose"
          icon="⭐"
        />
        <StatCard 
          title="Average Duration" 
          value={Math.round(analytics.averageDuration)}
          subtitle="Days"
          color="blue"
          icon="📅"
        />
        <StatCard 
          title="Active Departments" 
          value={analytics.departmentDistribution.length}
          subtitle="Different departments"
          color="cyan"
          icon="🏢"
        />
      </div>

      {showCharts && analytics.totalInterns > 0 && (
        <>
          {/* Monthly Trends */}
          <div className="w-full">
            <LineChart 
              data={analytics.monthlyData}
              title="Monthly Internship Trends"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <BarChart 
              data={analytics.topSchools.map(s => ({ label: s.school, value: s.count }))}
              title="Top Schools"
            />
            <BarChart 
              data={analytics.topFaculties.map(f => ({ label: f.faculty, value: f.count }))}
              title="Top Faculties"
            />
          </div>

          {/* Department Distribution */}
          <div className="w-full">
            <BarChart 
              data={analytics.departmentDistribution.map(d => ({ label: d.department, value: d.count }))}
              title="Department Distribution"
            />
          </div>
        </>
      )}
    </div>
  )
}