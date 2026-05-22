import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface GalleryImage {
  image: MediaType | number
  caption?: string | null
}

interface GalleryBlockProps {
  title?: string | null
  columns?: '2' | '3' | '4'
  images?: GalleryImage[]
  disableInnerContainer?: boolean
}

const gridClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

export const GalleryBlock: React.FC<GalleryBlockProps> = ({
  title = 'Galeri Foto',
  columns = '3',
  images,
  disableInnerContainer,
}) => {
  if (!images || images.length === 0) return null

  return (
    <section className="py-16">
      <div className={`container mx-auto ${disableInnerContainer ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-8">
            {title}
          </h2>
        )}

        <div className={`grid ${gridClasses[columns] || gridClasses['3']} gap-4`}>
          {images.map((item, index) => {
            const media = item.image
            if (!media || typeof media === 'number') return null

            return (
              <div key={index} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                <Media
                  resource={media}
                  imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  loading="lazy"
                  size={columns === '2' ? '(max-width: 640px) 100vw, 50vw' : columns === '4' ? '(max-width: 640px) 50vw, 25vw' : '(max-width: 640px) 100vw, 33vw'}
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs sm:text-sm text-white leading-snug">{item.caption}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
