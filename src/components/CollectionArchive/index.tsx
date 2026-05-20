'use client'
import React, { useState, useMemo } from 'react'
import { cn } from '@/utilities/ui'
import type { Post, Category, Media } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

interface CollectionArchiveProps {
  posts: Post[]
  categories?: Category[]
  className?: string
  showCategoryFilter?: boolean
  showSearch?: boolean
  maxPosts?: number
}

const MONTH_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MONTH_SHORT_ID[d.getMonth()]} ${d.getFullYear()}`
}

function getPostImage(post: Post): string | null {
  // Hero image
  const hero = (post as any).hero
  if (hero?.media && typeof hero.media === 'object' && hero.media.url) {
    return hero.media.url
  }

  // Featured image
  const featured = (post as any).featuredImage
  if (featured && typeof featured === 'object' && featured.url) {
    return featured.url
  }

  // Meta image
  const metaImage = (post.meta as any)?.image
  if (metaImage && typeof metaImage === 'object' && metaImage.url) {
    return metaImage.url
  }

  return null
}

function getPostCategories(post: Post): Category[] {
  if (!post.categories) return []
  return post.categories.filter((cat): cat is Category => typeof cat === 'object')
}

export const CollectionArchive: React.FC<CollectionArchiveProps> = ({
  posts: initialPosts,
  categories = [],
  className,
  showCategoryFilter = true,
  showSearch = true,
  maxPosts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = useMemo(() => {
    let filtered = initialPosts

    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.categories?.some((cat) => {
          const id = typeof cat === 'object' ? cat.id : cat
          return id === selectedCategory
        }),
      )
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.meta?.description?.toLowerCase().includes(q),
      )
    }

    if (maxPosts && maxPosts > 0) {
      filtered = filtered.slice(0, maxPosts)
    }

    return filtered
  }, [selectedCategory, searchTerm, initialPosts, maxPosts])

  const hasActiveFilters = selectedCategory || searchTerm

  const clearFilters = () => {
    setSelectedCategory(null)
    setSearchTerm('')
  }

  return (
    <div className={cn('space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Category Filter */}
        {showCategoryFilter && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                !selectedCategory
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  selectedCategory === category.id
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
                )}
              >
                {category.title}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-colors w-full sm:w-80 placeholder:text-gray-400"
            />
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredPosts.length === initialPosts.length
            ? `${filteredPosts.length} artikel`
            : `${filteredPosts.length} dari ${initialPosts.length} artikel`}
        </p>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-cyan-500 dark:text-cyan-400 hover:underline transition-colors"
          >
            Hapus filter
          </button>
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Tidak ada artikel ditemukan
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {hasActiveFilters
                ? 'Coba ubah filter atau kata kunci pencarian.'
                : 'Belum ada artikel yang tersedia saat ini.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function PostCard({ post }: { post: Post }) {
  const image = getPostImage(post)
  const postCategories = getPostCategories(post)

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full"
    >
      <div className="h-full flex flex-col">
        {image && (
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 h-48">
            <Image
              src={image}
              alt={post.title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-4 flex-grow flex flex-col">
          {/* Categories */}
          {postCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {postCategories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="inline-flex px-2 py-1 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full"
                >
                  {category.title}
                </span>
              ))}
              {postCategories.length > 2 && (
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  +{postCategories.length - 2} lainnya
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>

          {/* Description */}
          {post.meta?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 flex-grow">
              {post.meta.description}
            </p>
          )}

          {/* Date and Read More */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
            <span className="text-cyan-500 dark:text-cyan-400 group-hover:underline underline-offset-2 font-medium">
              Selengkapnya →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}