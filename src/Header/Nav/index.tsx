'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown, Menu, X } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
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

  // Function to set ref properly
  const setDropdownRef = (index: number) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[index] = el
  }

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDropdownToggle = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-3 items-center">
        {navItems.map(({ link, hasDropdown, dropdownItems }, i) => {
          const hasValidDropdown = hasDropdown && dropdownItems && dropdownItems.length > 0

          if (hasValidDropdown) {
            return (
              <div
                key={i}
                className="relative"
                ref={setDropdownRef(i)}
              >
                <button
                  onClick={() => handleDropdownToggle(i)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                  aria-expanded={openDropdown === i}
                >
                  {link.label}
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === i ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {openDropdown === i && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {dropdownItems.map((dropdownItem, j) => (
                        <div key={j} className="px-1">
                          <div onClick={() => setOpenDropdown(null)}>
                            <CMSLink
                              {...dropdownItem.link}
                              appearance="link"
                              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary rounded transition-colors"
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
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            />
          )
        })}
        
        <Link href="/search" className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5" />
        </Link>
        
        <ThemeSelector />
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <Link href="/search" className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5" />
        </Link>
        
        <ThemeSelector />
        
        <button
          onClick={handleMobileMenuToggle}
          className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map(({ link, hasDropdown, dropdownItems }, i) => {
              const hasValidDropdown = hasDropdown && dropdownItems && dropdownItems.length > 0

              return (
                <div key={i}>
                  {hasValidDropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(i)}
                        className="flex items-center justify-between w-full px-3 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        <span className="font-medium">{link.label}</span>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            openDropdown === i ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {openDropdown === i && (
                        <div className="ml-4 mt-1 space-y-1">
                          {dropdownItems.map((dropdownItem, j) => (
                            <div key={j} onClick={() => {
                              setIsMobileMenuOpen(false)
                              setOpenDropdown(null)
                            }}>
                              <CMSLink
                                {...dropdownItem.link}
                                appearance="link"
                                className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                      <CMSLink
                        {...link}
                        appearance="link"
                        className="block px-3 py-3 font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Mobile Theme Selector */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 py-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Theme</span>
              <ThemeSelector />
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}