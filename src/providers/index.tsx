import React from 'react'
import dynamic from 'next/dynamic'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AccessibilityProvider } from './Accessibility'

const AccessibilityPanel = dynamic(
  () => import('./Accessibility/AccessibilityPanel').then(m => m.AccessibilityPanel),
)
const ReadingGuideEffect = dynamic(
  () => import('./Accessibility/ReadingGuideEffect').then(m => m.ReadingGuideEffect),
)

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AccessibilityProvider>
          {children}
          <AccessibilityPanel />
          <ReadingGuideEffect />
        </AccessibilityProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
