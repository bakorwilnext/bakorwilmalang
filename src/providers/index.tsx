import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AccessibilityProvider } from './Accessibility'
import { AccessibilityPanel } from './Accessibility/AccessibilityPanel'
import { ReadingGuideEffect } from './Accessibility/ReadingGuideEffect'

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
