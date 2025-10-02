'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'
import canUseDOM from '@/utilities/canUseDOM'

export interface AccessibilitySettings {
  fontSize: number // 100 = default, range 80-150
  letterSpacing: number // 0 = default, range 0-5
  lineHeight: number // 1.5 = default, range 1.2-2.5
  highContrast: boolean
  grayscale: boolean
  invertColors: boolean
  readableFont: boolean
  hideImages: boolean
  highlightLinks: boolean
  textAlign: 'left' | 'center' | 'right' | 'justify' | 'default'
  cursorSize: 'default' | 'large' | 'xlarge'
  readingGuide: boolean
  focusHighlight: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => void
  resetSettings: () => void
  isPanelOpen: boolean
  togglePanel: () => void
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  letterSpacing: 0,
  lineHeight: 1.5,
  highContrast: false,
  grayscale: false,
  invertColors: false,
  readableFont: false,
  hideImages: false,
  highlightLinks: false,
  textAlign: 'default',
  cursorSize: 'default',
  readingGuide: false,
  focusHighlight: false,
}

const localStorageKey = 'accessibility-settings'

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSetting: () => null,
  resetSettings: () => null,
  isPanelOpen: false,
  togglePanel: () => null,
})

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (canUseDOM) {
      const stored = localStorage.getItem(localStorageKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (e) {
          console.error('Failed to parse accessibility settings:', e)
        }
      }
    }
  }, [])

  // Apply settings to DOM
  useEffect(() => {
    if (!canUseDOM) return

    const root = document.documentElement
    const body = document.body

    // Font size - apply to root for better scaling
    root.style.fontSize = `${settings.fontSize}%`

    // Letter spacing - apply to content areas
    root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}px`)

    // Line height - apply to content areas
    root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString())

    // High contrast
    if (settings.highContrast) {
      body.classList.add('accessibility-high-contrast')
    } else {
      body.classList.remove('accessibility-high-contrast')
    }

    // Grayscale
    if (settings.grayscale) {
      body.classList.add('accessibility-grayscale')
    } else {
      body.classList.remove('accessibility-grayscale')
    }

    // Invert colors
    if (settings.invertColors) {
      body.classList.add('accessibility-invert')
    } else {
      body.classList.remove('accessibility-invert')
    }

    // Readable font
    if (settings.readableFont) {
      body.classList.add('accessibility-readable-font')
    } else {
      body.classList.remove('accessibility-readable-font')
    }

    // Hide images
    if (settings.hideImages) {
      body.classList.add('accessibility-hide-images')
    } else {
      body.classList.remove('accessibility-hide-images')
    }

    // Highlight links
    if (settings.highlightLinks) {
      body.classList.add('accessibility-highlight-links')
    } else {
      body.classList.remove('accessibility-highlight-links')
    }

    // Text align
    root.style.setProperty(
      '--accessibility-text-align',
      settings.textAlign === 'default' ? 'inherit' : settings.textAlign,
    )

    // Cursor size
    body.classList.remove('accessibility-cursor-large', 'accessibility-cursor-xlarge')
    if (settings.cursorSize !== 'default') {
      body.classList.add(`accessibility-cursor-${settings.cursorSize}`)
    }

    // Reading guide
    if (settings.readingGuide) {
      body.classList.add('accessibility-reading-guide')
    } else {
      body.classList.remove('accessibility-reading-guide')
    }

    // Focus highlight
    if (settings.focusHighlight) {
      body.classList.add('accessibility-focus-highlight')
    } else {
      body.classList.remove('accessibility-focus-highlight')
    }

    // Save to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(settings))
  }, [settings])

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
    if (canUseDOM) {
      localStorage.removeItem(localStorageKey)
    }
  }, [])

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => !prev)
  }, [])

  return (
    <AccessibilityContext
      value={{
        settings,
        updateSetting,
        resetSettings,
        isPanelOpen,
        togglePanel,
      }}
    >
      {children}
    </AccessibilityContext>
  )
}

export const useAccessibility = (): AccessibilityContextType => use(AccessibilityContext)