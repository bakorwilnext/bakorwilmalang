import clsx from 'clsx'
import React from 'react'
import type { Media } from '@/payload-types'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  logo?: Media | null
  fixedHeight?: number // Height in pixels
}

export const Logo = (props: Props) => {
  const { 
    loading: loadingFromProps, 
    priority: priorityFromProps, 
    className, 
    logo,
    fixedHeight = 68 // Default height of 68px (34px * 2 for the scale-150)
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Default fallback logo
  const defaultLogoSrc = "https://bakorwilmalang.jatimprov.go.id/wp-content/uploads/2024/07/cropped-BAKORWIL-logo-copy-1.png"
  
  // Use uploaded logo if available, otherwise fallback
  const logoSrc = logo?.url || defaultLogoSrc
  const logoAlt = logo?.alt || "Bakorwil Logo"
  
  // Calculate width based on aspect ratio if dimensions are available
  let calculatedWidth = 193 // default width
  let calculatedHeight = fixedHeight
  
  if (logo?.width && logo?.height) {
    // Calculate width maintaining aspect ratio with fixed height
    const aspectRatio = logo.width / logo.height
    calculatedWidth = Math.round(fixedHeight * aspectRatio)
  }

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={logoAlt}
      width={calculatedWidth}
      height={calculatedHeight}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(
        'h-auto object-contain', // Remove fixed height classes and use object-contain
        className
      )}
      src={logoSrc}
      style={{
        height: `${fixedHeight}px`,
        width: 'auto', // Let width adjust automatically
        maxWidth: '100%', // Prevent overflow
      }}
    />
  )
}