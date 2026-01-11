'use client'

import React, { useEffect, useState, useRef } from 'react'

interface LazyMapProps {
  src: string
  title: string
  className?: string
}

export const LazyMap: React.FC<LazyMapProps> = ({ src, title, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Delay actual loading by 100ms after becoming visible
            setTimeout(() => setShouldLoad(true), 100)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={`w-full h-64 rounded-lg overflow-hidden shadow-lg ${className}`}>
      {shouldLoad ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {isVisible ? 'Loading map...' : 'Map'}
          </span>
        </div>
      )}
    </div>
  )
}
