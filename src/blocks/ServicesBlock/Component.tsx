import React from 'react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Define the types directly since they don't exist in payload-types yet
interface ServiceItem {
  image: any // Will be populated with Media relation
  title: string
  subtitle?: string
  description?: string
  link?: {
    type?: 'reference' | 'custom'
    reference?: {
      value: any
      relationTo: 'pages' | 'posts'
    }
    url?: string
    newTab?: boolean
  }
}

interface ServicesBlockProps {
  blockType: 'servicesBlock'
  sectionTitle?: string
  sectionSubtitle?: string
  introContent?: any // Rich text content
  services?: ServiceItem[]
}

type Props = {
  className?: string
  disableInnerContainer?: boolean
} & ServicesBlockProps

// Simple className utility function
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const ServicesBlock: React.FC<Props> = async (props) => {
  const {
    className,
    disableInnerContainer,
    sectionTitle,
    sectionSubtitle,
    services,
    introContent,
  } = props

  const payload = await getPayload({ config: configPromise })

  // Helper function to generate link href
  const generateHref = (service: ServiceItem): string | null => {
    const { link } = service
    
    if (!link) return null
    
    if (link.type === 'custom' && link.url) {
      return link.url
    }
    
    if (link.type === 'reference' && link.reference) {
      const { value, relationTo } = link.reference
      
      if (typeof value === 'object' && value?.slug) {
        if (relationTo === 'pages') {
          return value.slug === 'home' ? '/' : `/${value.slug}`
        }
        if (relationTo === 'posts') {
          return `/posts/${value.slug}`
        }
      }
    }
    
    return null
  }

  return (
    <section className={cn('py-16 from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900', className)}>
      <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', disableInnerContainer && 'px-0')}>
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle || introContent) && (
          <div className="text-center mb-12 lg:mb-16">
            {sectionTitle && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {sectionTitle}
              </h2>
            )}
            
            {sectionSubtitle && (
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
            
            {introContent && (
              <div className="prose dark:prose-invert max-w-4xl mx-auto">
                {/* You can render rich text content here if needed */}
                {typeof introContent === 'string' ? (
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {introContent}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}
        
        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services?.map((service: ServiceItem, index: number) => {
            const { image, title, subtitle, description, link } = service
            const href = generateHref(service)
            const isExternal = link?.type === 'custom' && link?.url?.startsWith('http')
            
            const CardContent = (
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 border border-gray-100 dark:border-gray-700 h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden">
                  {image && typeof image === 'object' && (
                    <Image
                      alt={image.alt || title || ''}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      fill
                      src={image.url || ''}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Link Indicator */}
                  {href && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        {isExternal ? (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
                  {title && (
                    <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {title}
                    </h3>
                  )}
                  
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 font-medium line-clamp-1">
                      {subtitle}
                    </p>
                  )}
                  
                  {description && (
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 leading-relaxed line-clamp-2 sm:line-clamp-3 flex-1">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )
            
            return (
              <div key={index} className="flex">
                {href ? (
                  isExternal ? (
                    <a
                      href={href}
                      target={link?.newTab ? '_blank' : '_self'}
                      rel={link?.newTab ? 'noopener noreferrer' : undefined}
                      className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl sm:rounded-2xl"
                      aria-label={`Visit ${title}${isExternal ? ' (opens in new tab)' : ''}`}
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      target={link?.newTab ? '_blank' : '_self'}
                      className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl sm:rounded-2xl"
                      aria-label={`Go to ${title}`}
                    >
                      {CardContent}
                    </Link>
                  )
                ) : (
                  <div className="w-full">
                    {CardContent}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Empty State */}
        {(!services || services.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8v4l-3-3-3 3v-4H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h8V3l3 3 3-3v4z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-2">No services available</h3>
            <p className="text-gray-600 dark:text-gray-400">Services will be displayed here once they are added.</p>
          </div>
        )}
      </div>
    </section>
  )
}