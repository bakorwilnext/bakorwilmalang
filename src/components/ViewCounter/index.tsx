'use client'
import React, { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  slug: string
  initialViews?: number
  className?: string
}

export const ViewCounter: React.FC<ViewCounterProps> = ({ 
  slug, 
  initialViews = 0,
  className = '' 
}) => {
  const [views, setViews] = useState<number>(initialViews)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const incrementView = async () => {
      try {                                                                  
        const viewedKey = `post_viewed_${slug}`
        const hasViewed = sessionStorage.getItem(viewedKey)

        if (!hasViewed) {                                     
          const response = await fetch('/api/post-views', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug }),
          })

          if (response.ok) {
            const data = await response.json()
            setViews(data.viewCount)                                            
            sessionStorage.setItem(viewedKey, 'true')
          }
        } else {                                                              
          const response = await fetch(`/api/post-views?slug=${slug}`)
          if (response.ok) {
            const data = await response.json()
            setViews(data.viewCount)
          }
        }
      } catch (error) {
        console.error('Error updating view count:', error)
      } finally {
        setIsLoading(false)
      }
    }

    incrementView()
  }, [slug])

  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <Eye className="w-4 h-4" />
      <span>
        {isLoading ? (
          <span className="inline-block w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ) : (
          <>
            {formatViews(views)} {views === 1 ? 'view' : 'views'}
          </>
        )}
      </span>
    </div>
  )
}