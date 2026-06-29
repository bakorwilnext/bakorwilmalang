'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'
import canUseDOM from '@/utilities/canUseDOM'

export interface AccessibilitySettings {
  fontSize: number                               
  letterSpacing: number                          
  lineHeight: number                                
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
                       
  useEffect(() => {
    if (!canUseDOM) return

    const root = document.documentElement
    const body = document.body
                                                   
    root.style.fontSize = `${settings.fontSize}%`
                                              
    root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}px`)
                                           
    root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString())
                                                                           
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast')
    } else {
      root.classList.remove('accessibility-high-contrast')
    }
                
    if (settings.grayscale) {
      root.classList.add('accessibility-grayscale')
    } else {
      root.classList.remove('accessibility-grayscale')
    }
                    
    if (settings.invertColors) {
      root.classList.add('accessibility-invert')
    } else {
      root.classList.remove('accessibility-invert')
    }
                   
    if (settings.readableFont) {
      body.classList.add('accessibility-readable-font')
    } else {
      body.classList.remove('accessibility-readable-font')
    }
                 
    if (settings.hideImages) {
      body.classList.add('accessibility-hide-images')
    } else {
      body.classList.remove('accessibility-hide-images')
    }
                     
    if (settings.highlightLinks) {
      body.classList.add('accessibility-highlight-links')
    } else {
      body.classList.remove('accessibility-highlight-links')
    }
                 
    root.style.setProperty(
      '--accessibility-text-align',
      settings.textAlign === 'default' ? 'inherit' : settings.textAlign,
    )
                  
    body.classList.remove('accessibility-cursor-large', 'accessibility-cursor-xlarge')
    if (settings.cursorSize !== 'default') {
      body.classList.add(`accessibility-cursor-${settings.cursorSize}`)
    }
                   
    if (settings.readingGuide) {
      body.classList.add('accessibility-reading-guide')
    } else {
      body.classList.remove('accessibility-reading-guide')
    }
                      
    if (settings.focusHighlight) {
      body.classList.add('accessibility-focus-highlight')
    } else {
      body.classList.remove('accessibility-focus-highlight')
    }
                           
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