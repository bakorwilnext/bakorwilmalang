'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface ElasticHeaderNavProps {
  data: HeaderType
}

const SearchSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
)

const ChevronDownSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
)

const MenuSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
)

const XSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
)

const Volume2Svg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
)

const VolumeXSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>
)

export const ElasticHeaderNav: React.FC<ElasticHeaderNavProps> = ({ data }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isSpeechInitialized, setIsSpeechInitialized] = useState(false)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navItems = data?.navItems || []

  const speak = useCallback((text: string) => {
    if (!isVoiceEnabled || !isSpeechInitialized || typeof window === 'undefined') return
    
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
    }
    
    window.speechSynthesis.cancel()
    
    speechTimeoutRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      const voices = window.speechSynthesis.getVoices()
      const indonesianVoice = voices.find(voice => 
        voice.lang.includes('id') || voice.lang.includes('ID')
      )
      if (indonesianVoice) {
        utterance.voice = indonesianVoice
      }
      
      window.speechSynthesis.speak(utterance)
    }, 50)
  }, [isVoiceEnabled, isSpeechInitialized])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const deferredInit = setTimeout(() => {
      const loadVoices = () => {
        window.speechSynthesis.getVoices()
      }
      
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
      
      const handleFirstInteraction = () => {
        setIsSpeechInitialized(true)
        loadVoices()
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('touchstart', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
      }
      
      document.addEventListener('click', handleFirstInteraction, { once: true })
      document.addEventListener('touchstart', handleFirstInteraction, { once: true })
      document.addEventListener('keydown', handleFirstInteraction, { once: true })
    }, 3000)

    return () => {
      clearTimeout(deferredInit)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
      }
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        const dropdownElement = dropdownRefs.current[openDropdown]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const setDropdownRef = (index: number) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[index] = el
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
        setOpenMobileDropdown(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDropdownToggle = (index: number, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenDropdown(openDropdown === index ? null : index)
  }

  const handleMobileDropdownToggle = (index: number, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenMobileDropdown(openMobileDropdown === index ? null : index)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setOpenMobileDropdown(null)
  }

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel()
    }
    speak(isVoiceEnabled ? 'Suara navigasi dimatikan' : 'Suara navigasi dinyalakan')
  }

  return (
    <div className="bg-slate-700 shadow-md">
      <div className="container mx-auto">
        <nav className="hidden md:flex justify-center items-center py-4">
          <div className="flex items-center gap-8">
            {navItems.map(({ link, hasDropdown, dropdownItems }, i) => {
              const hasValidDropdown = hasDropdown && dropdownItems && dropdownItems.length > 0

              if (hasValidDropdown) {
                return (
                  <div
                    key={i}
                    className="relative"
                    ref={setDropdownRef(i)}
                  >
                    <div className="flex items-center gap-0.5">
                      <div 
                        onClick={() => setOpenDropdown(null)}
                        onMouseEnter={() => speak(`Menu ${link.label}`)}
                      >
                        <CMSLink 
                          {...link}
                          appearance="link" 
                          className="px-3 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors uppercase tracking-wider"
                        />
                      </div>
                      <button
                        onClick={(e) => handleDropdownToggle(i, e)}
                        onMouseEnter={() => speak(`${link.label} memiliki submenu`)}
                        className="p-1 text-white hover:text-cyan-400 transition-colors"
                        aria-expanded={openDropdown === i}
                        aria-label={`Toggle ${link.label} dropdown`}
                      >
                        <ChevronDownSvg 
                          className={`transition-transform duration-300 ${
                            openDropdown === i ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>
                    
                    {openDropdown === i && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                        <div className="py-1">
                          {dropdownItems.map((dropdownItem, j) => (
                            <div key={j} className="px-1">
                              <div 
                                onClick={() => setOpenDropdown(null)}
                                onMouseEnter={() => speak(`Submenu ${dropdownItem.link.label}`)}
                              >
                                <CMSLink
                                  {...dropdownItem.link}
                                  appearance="link"
                                  className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div
                  key={i}
                  onMouseEnter={() => speak(`Menu ${link.label}`)}
                >
                  <CMSLink 
                    {...link} 
                    appearance="link" 
                    className="px-3 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors uppercase tracking-wider"
                  />
                </div>
              )
            })}
          </div>
          
          <div className="flex items-center gap-3 ml-8">
            <Link 
              href="/search" 
              className="p-2 text-white hover:text-cyan-400 transition-colors"
              onMouseEnter={() => speak('Pencarian')}
            >
              <span className="sr-only">Search</span>
              <SearchSvg />
            </Link>
            
            <button
              onClick={toggleVoice}
              className="p-2 text-white hover:text-cyan-400 transition-colors"
              title={isVoiceEnabled ? 'Matikan suara' : 'Nyalakan suara'}
              aria-label={isVoiceEnabled ? 'Matikan suara navigasi' : 'Nyalakan suara navigasi'}
            >
              {isVoiceEnabled ? <Volume2Svg /> : <VolumeXSvg />}
            </button>
            
            <div className="text-white">
              <ThemeSelector />
            </div>
          </div>
        </nav>

        <div className="md:hidden flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/search" 
              className="p-2 text-white hover:text-cyan-400 transition-colors"
            >
              <span className="sr-only">Search</span>
              <SearchSvg />
            </Link>
            
            <button
              onClick={toggleVoice}
              className="p-2 text-white hover:text-cyan-400 transition-colors"
              title={isVoiceEnabled ? 'Matikan suara' : 'Nyalakan suara'}
            >
              {isVoiceEnabled ? <Volume2Svg /> : <VolumeXSvg />}
            </button>
            
            <div className="text-white">
              <ThemeSelector />
            </div>
          </div>
          
          <button
            onClick={handleMobileMenuToggle}
            className="p-2 text-white hover:text-cyan-400 transition-colors"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Toggle menu</span>
            {isMobileMenuOpen ? <XSvg /> : <MenuSvg />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => {
            setIsMobileMenuOpen(false)
            setOpenMobileDropdown(null)
          }} 
        />
      )}

      <div className={`
        fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 md:hidden flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              setOpenMobileDropdown(null)
            }}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Tutup menu"
          >
            <span className="sr-only">Tutup menu</span>
            <XSvg />
          </button>
        </div>
        
        <nav className="flex-1 p-4 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(({ link, hasDropdown, dropdownItems }, i) => {
              const hasValidDropdown = hasDropdown && dropdownItems && dropdownItems.length > 0

              return (
                <div key={i} className="bg-white dark:bg-gray-900">
                  {hasValidDropdown ? (
                    <>
                      <div className="flex items-center bg-white dark:bg-gray-900">
                        <div 
                          className="flex-1"
                          onClick={() => {
                            if (!openMobileDropdown || openMobileDropdown !== i) {
                              return
                            }
                            setIsMobileMenuOpen(false)
                            setOpenMobileDropdown(null)
                          }}
                          onTouchStart={() => speak(`Menu ${link.label}`)}
                        >
                          <CMSLink
                            {...link}
                            appearance="link"
                            className="block px-3 py-3 font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors bg-white dark:bg-gray-900 uppercase tracking-wider"
                          />
                        </div>
                        <button
                          onClick={(e) => handleMobileDropdownToggle(i, e)}
                          onTouchStart={() => speak(`${link.label} memiliki submenu`)}
                          className="p-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-gray-900"
                        >
                          <ChevronDownSvg 
                            className={`transition-transform duration-300 ${
                              openMobileDropdown === i ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                      
                      {openMobileDropdown === i && (
                        <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200 bg-white dark:bg-gray-900">
                          {dropdownItems.map((dropdownItem, j) => (
                            <div 
                              key={j} 
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                setOpenMobileDropdown(null)
                              }}
                              onTouchStart={() => speak(`Submenu ${dropdownItem.link.label}`)}
                            >
                              <CMSLink
                                {...dropdownItem.link}
                                appearance="link"
                                className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors bg-white dark:bg-gray-900"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div 
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setOpenMobileDropdown(null)
                      }}
                      onTouchStart={() => speak(`Menu ${link.label}`)}
                    >
                      <CMSLink
                        {...link}
                        appearance="link"
                        className="block px-3 py-3 font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors bg-white dark:bg-gray-900 uppercase tracking-wider"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}