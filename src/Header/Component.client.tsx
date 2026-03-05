'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { ElasticHeaderNav } from './ElasticNav'

const FacebookSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const TwitterSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
)

const InstagramSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)

const YoutubeSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
)

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = React.useRef<HTMLDivElement>(null)
  const navOffsetRef = React.useRef<number>(0)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date())
  }, [])

  useEffect(() => {
    if (!isClient) return

    const startTimer = () => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return intervalId
    }

    let intervalId: NodeJS.Timeout

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => {
        intervalId = startTimer()
      })
      return () => {
        window.cancelIdleCallback(idleId)
        if (intervalId) clearInterval(intervalId)
      }
    } else {
      const timeoutId = setTimeout(() => {
        intervalId = startTimer()
      }, 2000)
      return () => {
        clearTimeout(timeoutId)
        if (intervalId) clearInterval(intervalId)
      }
    }
  }, [isClient])

  useEffect(() => {
    const calculateOffset = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        navOffsetRef.current = rect.top + window.scrollY
      }
    }
    
    calculateOffset()
    window.addEventListener('resize', calculateOffset, { passive: true })
    
    return () => {
      window.removeEventListener('resize', calculateOffset)
    }
  }, [])

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const threshold = navOffsetRef.current
          
          setIsScrolled(scrollY >= threshold && threshold > 0)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(date)
  }, [])

  const formatTime = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date)
  }, [])

  return (
    <div {...(theme ? { 'data-theme': theme } : {})}>
      <div className="bg-cyan-500 text-black py-2 px-4 relative z-40">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            {isClient && currentTime ? (
              <>
                <span suppressHydrationWarning>{formatDate(currentTime)}</span>
                <span suppressHydrationWarning>{formatTime(currentTime)}</span>
              </>
            ) : (
              <>
                <span>Loading...</span>
                <span>--:--:--</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="https://facebook.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="Facebook"
            >
              <FacebookSvg />
            </Link>
            <Link 
              href="https://twitter.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="Twitter"
            >
              <TwitterSvg />
            </Link>
            <Link 
              href="https://instagram.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="Instagram"
            >
              <InstagramSvg />
            </Link>
            <Link 
              href="https://youtube.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="YouTube"
            >
              <YoutubeSvg />
            </Link>
          </div>
        </div>
      </div>

      <div className="py-6 relative z-30">
        <div className="container mx-auto text-center">
          <Link href="/" className="inline-block">
            <Logo 
              loading="eager" 
              priority="high" 
              className="mx-auto"
              logo={typeof data.logo === 'object' ? data.logo : null}
              fixedHeight={100}
            />
          </Link>
        </div>
      </div>

      {isScrolled && navRef.current && (
        <div style={{ height: navRef.current.offsetHeight }} aria-hidden="true" />
      )}
      
      <div 
        ref={navRef}
        className={isScrolled ? 'fixed top-0 left-0 right-0 z-50' : ''}
      >
        <ElasticHeaderNav data={data} />
      </div>
    </div>
  )
}