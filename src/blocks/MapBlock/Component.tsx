'use client'

import React, { useRef, useState, useEffect } from 'react'

interface MapBlockProps {
  title?: string | null
  embedUrl: string
  height?: '350' | '500' | '650' | '800'
  disableInnerContainer?: boolean
}

export const MapBlock: React.FC<MapBlockProps> = ({
  title,
  embedUrl,
  height = '500',
  disableInnerContainer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!embedUrl) return null

  return (
    <section className="py-16">
      <div className={`container mx-auto ${disableInnerContainer ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-8">
            {title}
          </h2>
        )}

        <div
          ref={containerRef}
          className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
          style={{ height: `${height}px` }}
        >
          {isVisible ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={title || 'Google Maps'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
