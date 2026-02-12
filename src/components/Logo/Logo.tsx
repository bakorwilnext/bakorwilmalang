import clsx from 'clsx'
import React from 'react'
import NextImage from 'next/image'
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
    fixedHeight = 68
  } = props

  const loading = loadingFromProps || 'lazy'
  const isPriority = priorityFromProps === 'high'

  // Default fallback logo
  const defaultLogoSrc = "/BAKORWIL-logo-header.webp"
  
  // Use uploaded logo if available, otherwise fallback
  const logoSrc = logo?.url || defaultLogoSrc
  const logoAlt = logo?.alt || "Bakorwil Logo"
  
  // Calculate width based on aspect ratio if dimensions are available
  let calculatedWidth = 193 // default width
  const calculatedHeight = fixedHeight
  
  if (logo?.width && logo?.height) {
    const aspectRatio = logo.width / logo.height
    calculatedWidth = Math.round(fixedHeight * aspectRatio)
  }

  return (
    <NextImage
      alt={logoAlt}
      width={calculatedWidth}
      height={calculatedHeight}
      loading={isPriority ? undefined : loading}
      priority={isPriority}
      quality={60}
      className={clsx(
        'h-auto object-contain',
        className
      )}
      src={logoSrc}
    />
  )
}