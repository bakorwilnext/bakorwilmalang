'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useRef, useCallback } from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'

const ChevronLeftSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
)

const ChevronRightSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
)

type CustomHeroClientProps = Page['hero'] & {
  richTextContent?: React.ReactNode
}

export const CustomHeroClient: React.FC<CustomHeroClientProps> = ({ media, richTextContent, carouselImages }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [isCarouselVisible, setIsCarouselVisible] = useState(false)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const carouselItems = Array.isArray(carouselImages) ? carouselImages : []

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }, [carouselItems.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }, [carouselItems.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (!carouselRef.current || carouselItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCarouselVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px' }
    )

    observer.observe(carouselRef.current)

    return () => observer.disconnect()
  }, [carouselItems.length])

  useEffect(() => {
    if (isAutoplay && carouselItems.length > 1 && isCarouselVisible) {
      autoplayRef.current = setInterval(nextSlide, 5000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [isAutoplay, carouselItems.length, isCarouselVisible, nextSlide])

  const handleMouseEnter = useCallback(() => {
    setIsAutoplay(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsAutoplay(true)
  }, [])

  useEffect(() => {
    if (!isCarouselVisible || carouselItems.length <= 1) return

    const nextIndex = (currentIndex + 1) % carouselItems.length
    const nextItem = carouselItems[nextIndex]
    
    if (typeof nextItem === 'object' && nextItem !== null && 'url' in nextItem) {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'image'
      link.href = nextItem.url as string
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [currentIndex, carouselItems, isCarouselVisible])

  return (
    <div className="relative w-full overflow-visible bg-cyan-500">
      <div className="relative w-full h-[60vh] overflow-hidden">
        {media && typeof media === 'object' && (
          <Media
            fill
            priority
            imgClassName="object-cover object-center"
            resource={media}
            size="100vw"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        
        <div className="absolute bottom-[60%] left-0 w-full px-8 text-center text-white">
          {richTextContent && (
            <div className="max-w-4xl mx-auto">
              {richTextContent}
            </div>
          )}
        </div>
      </div>

      {carouselItems.length > 0 && (
        <div 
          ref={carouselRef}
          className="relative w-full max-w-3xl mx-auto -mt-56 px-4 z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-center relative w-full">
            {carouselItems.length > 1 && (
              <button
                className="absolute left-2 sm:-left-5 bg-white/70 hover:bg-cyan-500 text-gray-800 hover:text-white border-none rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 z-10 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-cyan-500 dark:hover:text-white"
                onClick={prevSlide}
                aria-label="Previous slide"
                type="button"
              >
                <ChevronLeftSvg />
              </button>
            )}

            <div className="relative w-full h-64 overflow-hidden bg-transparent">
              {isCarouselVisible && carouselItems.map((item, index) => {
                if (typeof item === 'object' && item !== null) {
                  const isVisible = 
                    index === currentIndex || 
                    index === (currentIndex - 1 + carouselItems.length) % carouselItems.length ||
                    index === (currentIndex + 1) % carouselItems.length

                  if (!isVisible) return null

                  return (
                    <div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
                    >
                      <div className="relative rounded-lg overflow-hidden w-full h-full bg-transparent">
                        <Media
                          className="w-full h-full"
                          imgClassName="w-full h-full object-contain"
                          resource={item}
                          priority={index === currentIndex}
                          loading={index === currentIndex ? 'eager' : 'lazy'}
                          size="(max-width: 640px) 100vw, 768px"
                        />
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>

            {carouselItems.length > 1 && (
              <button
                className="absolute right-2 sm:-right-5 bg-white/70 hover:bg-cyan-500 text-gray-800 hover:text-white border-none rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 z-10 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-cyan-500 dark:hover:text-white"
                onClick={nextSlide}
                aria-label="Next slide"
                type="button"
              >
                <ChevronRightSvg />
              </button>
            )}
          </div>

          {carouselItems.length > 1 && (
            <div className="flex justify-center gap-1 mt-4">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  className="min-w-12 min-h-12 p-0 border-none cursor-pointer transition-all duration-300 flex items-center justify-center"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  type="button"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-cyan-500 scale-110'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
