'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const CustomHero: React.FC<Page['hero']> = ({ media, richText, carouselImages }) => {
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

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
      { rootMargin: '100px' }
    )

    observer.observe(carouselRef.current)

    return () => observer.disconnect()
  }, [carouselItems.length])

  useEffect(() => {
    if (isAutoplay && carouselItems.length > 1 && isCarouselVisible) {
      autoplayRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [isAutoplay, currentIndex, carouselItems.length, isCarouselVisible])

  const handleMouseEnter = () => {
    setIsAutoplay(false)
  }

  const handleMouseLeave = () => {
    setIsAutoplay(true)
  }

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
    }
  }, [currentIndex, carouselItems, isCarouselVisible])

  return (
    <div className="relative w-full overflow-visible" data-theme="dark">
      <div className="relative w-full h-[60vh] overflow-hidden">
        {media && typeof media === 'object' && (
          <Media
            fill
            priority
            imgClassName="object-cover object-center"
            resource={media}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        
        <div className="absolute bottom-[60%] left-0 w-full px-8 text-center text-white">
          {richText && (
            <div className="max-w-4xl mx-auto">
              <RichText 
                className="[&_h1]:text-5xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:drop-shadow-md [&_p]:text-2xl [&_p]:max-w-3xl [&_p]:mx-auto [&_p]:drop-shadow-sm" 
                data={richText} 
                enableGutter={false} 
              />
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
                className="absolute -left-5 bg-white/70 hover:bg-blue-500 text-gray-800 hover:text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 z-10 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-white"
                onClick={prevSlide}
                aria-label="Previous slide"
                type="button"
              >
                <ChevronLeft className="w-4 h-4" />
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
                          priority={false}
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
                className="absolute -right-5 bg-white/70 hover:bg-blue-500 text-gray-800 hover:text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 z-10 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-white"
                onClick={nextSlide}
                aria-label="Next slide"
                type="button"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {carouselItems.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full border-none p-0 cursor-pointer transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-500 scale-110'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}