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
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date())
  }, [])

  // Update time every second only on client
  useEffect(() => {
    if (!isClient) return

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [isClient])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date)
  }

  return (
    <div {...(theme ? { 'data-theme': theme } : {})}>
      <div className="bg-cyan-500 text-white py-2 px-4 relative z-40">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            {isClient && currentTime ? (
              <>
                <span>{formatDate(currentTime)}</span>
                <span>{formatTime(currentTime)}</span>
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

      {/* Navigation Bar - Sticky with higher z-index */}
      <div className="sticky top-0 z-50">
        <ElasticHeaderNav data={data} />
      </div>
    </div>
  )
}