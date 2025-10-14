'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown, Menu, X } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface ElasticHeaderNavProps {
  data: HeaderType
}

export const ElasticHeaderNav: React.FC<ElasticHeaderNavProps> = ({ data }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const navItems = data?.navItems || []

  // Close dropdown when clicking outside
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

  // Close mobile menu when screen size changes
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

  return (
    <div className="sticky top-0 z-50 bg-slate-700 shadow-md">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
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
                      <div onClick={() => setOpenDropdown(null)}>
                        <CMSLink 
                          {...link}
                          appearance="link" 
                          className="px-3 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors uppercase tracking-wider"
                        />
                      </div>
                      <button
                        onClick={(e) => handleDropdownToggle(i, e)}
                        className="p-1 text-white hover:text-cyan-400 transition-colors"
                        aria-expanded={openDropdown === i}
                        aria-label={`Toggle ${link.label} dropdown`}
                      >
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-300 ${
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
                              <div onClick={() => setOpenDropdown(null)}>
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
                <CMSLink 
                  key={i} 
                  {...link} 
                  appearance="link" 
                  className="px-3 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors uppercase tracking-wider"
                />
              )
            })}
          </div>
          
          <div className="flex items-center gap-3 ml-8">
            <Link 
              href="/search" 
              className="p-2 text-white hover:text-cyan-400 transition-colors"
            >
              <span className="sr-only">Search</span>
              <SearchIcon className="w-5 h-5" />
            </Link>
            
            <div className="text-white">
              <ThemeSelector />
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/search" 
              className="p-2 text-white hover:text-cyan-400 transition-colors"
            >
              <span className="sr-only">Search</span>
              <SearchIcon className="w-5 h-5" />
            </Link>
            
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
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => {
            setIsMobileMenuOpen(false)
            setOpenMobileDropdown(null)
          }} 
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 md:hidden flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              setOpenMobileDropdown(null)
            }}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation Content */}
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
                        >
                          <CMSLink
                            {...link}
                            appearance="link"
                            className="block px-3 py-3 font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors bg-white dark:bg-gray-900 uppercase tracking-wider"
                          />
                        </div>
                        <button
                          onClick={(e) => handleMobileDropdownToggle(i, e)}
                          className="p-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-gray-900"
                        >
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-300 ${
                              openMobileDropdown === i ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>
                      
                      {openMobileDropdown === i && (
                        <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200 bg-white dark:bg-gray-900">
                          {dropdownItems.map((dropdownItem, j) => (
                            <div key={j} onClick={() => {
                              setIsMobileMenuOpen(false)
                              setOpenMobileDropdown(null)
                            }}>
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
                    <div onClick={() => {
                      setIsMobileMenuOpen(false)
                      setOpenMobileDropdown(null)
                    }}>
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