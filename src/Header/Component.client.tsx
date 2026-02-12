'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { ElasticHeaderNav } from './ElasticNav'

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

    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(intervalId)
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
    handleScroll() // Check initial state
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date)
  }

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
              <Facebook size={18} />
            </Link>
            <Link 
              href="https://twitter.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </Link>
            <Link 
              href="https://instagram.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </Link>
            <Link 
              href="https://youtube.com" 
              className="hover:text-cyan-200 transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={18} />
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