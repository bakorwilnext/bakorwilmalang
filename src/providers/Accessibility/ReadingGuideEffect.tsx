'use client'

import { useEffect } from 'react'
import { useAccessibility } from '@/providers/Accessibility'

export const ReadingGuideEffect: React.FC = () => {
  const { settings } = useAccessibility()

  useEffect(() => {
    if (!settings.readingGuide) return

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY - 30}px`)
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [settings.readingGuide])

  return null
}