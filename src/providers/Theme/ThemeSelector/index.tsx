'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = () => {
    if (value === 'auto') {
      setTheme('light')
      setValue('light')
    } else if (value === 'light') {
      setTheme('dark')
      setValue('dark')
    } else {
      setTheme(null)
      setValue('auto')
    }
  }

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  const getSvgContent = () => {
    switch (value) {
      case 'light':
        // Sun icon
        return (
          <g>
            <circle
              cx="12"
              cy="12"
              r="5"
              fill="currentColor"
              className="transition-all duration-300"
            />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </g>
          </g>
        )
      case 'dark':
        // Moon icon
        return (
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            fill="currentColor"
            className="transition-all duration-300"
          />
        )
      default:
        // Auto - Half sun half moon
        return (
          <g>
            <defs>
              <clipPath id="half">
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            {/* Sun half */}
            <g clipPath="url(#half)">
              <circle
                cx="12"
                cy="12"
                r="5"
                fill="currentColor"
                className="transition-all duration-300"
              />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </g>
            </g>
            {/* Moon half */}
            <g>
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="currentColor"
                className="transition-all duration-300"
                clipPath="url(#half-moon)"
              />
              <defs>
                <clipPath id="half-moon">
                  <rect x="12" y="0" width="12" height="24" />
                </clipPath>
              </defs>
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="currentColor"
                className="transition-all duration-300"
                clipPath="url(#half-moon)"
              />
            </g>
          </g>
        )
    }
  }

  const getTooltipText = () => {
    switch (value) {
      case 'light': return 'Switch to Dark Mode'
      case 'dark': return 'Switch to Auto Mode'
      default: return 'Switch to Light Mode'
    }
  }

  return (
    <button
      onClick={onThemeChange}
      className="p-2 rounded-md hover:bg-white/10 transition-colors"
      title={getTooltipText()}
      aria-label={getTooltipText()}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="transition-all duration-300 text-current"
      >
        {getSvgContent()}
      </svg>
    </button>
  )
}