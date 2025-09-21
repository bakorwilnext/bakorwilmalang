'use client'
import React from 'react'
import { format } from 'date-fns'
import { cn } from '@/utilities/ui'
import type { Post, Category, Media } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'

interface CollectionArchiveProps {
  posts: Post[]
  categories?: Category[]
  className?: string
  showCategoryFilter?: boolean
  showSearch?: boolean
  maxPosts?: number
}

// Type guard to check if an object has a hero property
const hasHero = (post: any): post is Post & { hero: any } => {
  return post && typeof post === 'object' && 'hero' in post
}

// Type guard to check if an object has a featuredImage property
const hasFeaturedImage = (post: any): post is Post & { featuredImage: Media } => {
  return post && typeof post === 'object' && 'featuredImage' in post
}

export const CollectionArchive: React.FC<CollectionArchiveProps> = ({
  posts: initialPosts,
  categories = [],
  className,
  showCategoryFilter = true,
  showSearch = true,
  maxPosts,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filteredPosts, setFilteredPosts] = React.useState(initialPosts)

  // Filter posts based on category and search
  React.useEffect(() => {
    let filtered = initialPosts

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => 
        post.categories?.some(cat => {
          const categoryId = typeof cat === 'object' ? cat.id : cat
          return categoryId === selectedCategory
        })
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.meta?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply maximum posts limit if specified
    if (maxPosts && maxPosts > 0) {
      filtered = filtered.slice(0, maxPosts)
    }

    setFilteredPosts(filtered)
  }, [selectedCategory, searchTerm, initialPosts, maxPosts])

  const getPostImage = (post: Post): string | null => {
    // Check if post has hero image
    if (hasHero(post) && post.hero?.media) {
      const media = post.hero.media as Media
      return media?.url || null
    }
    
    // Fallback: check if there's a featuredImage field
    if (hasFeaturedImage(post) && post.featuredImage) {
      const media = post.featuredImage as Media
      return media?.url || null
    }
    
    // Another fallback: check meta image if it exists
    if (post.meta && typeof post.meta === 'object' && 'image' in post.meta) {
      const metaImage = (post.meta as any).image
      if (metaImage && typeof metaImage === 'object' && 'url' in metaImage) {
        return metaImage.url || null
      }
    }
    
    return null
  }

  const getPostCategories = (post: Post): Category[] => {
    if (!post.categories) return []
    return post.categories.filter(cat => typeof cat === 'object') as Category[]
  }

  const PostCard = ({ post }: { post: Post }) => {
    const image = getPostImage(post)
    const postCategories = getPostCategories(post)
    
    return (
      <Link 
        href={`/posts/${post.slug}`}
        className="group block dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full"
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

          {/* Content */}
          <div className="p-4 flex-grow flex flex-col">
            {/* Categories */}
            {postCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {postCategories.slice(0, 2).map(category => (
                  <span
                    key={category.id}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {category.title}
                  </span>
                ))}
                {postCategories.length > 2 && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                    +{postCategories.length - 2} more
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
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
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                </time>
              )}
              <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const CategoryButton = ({ 
    category, 
    isActive, 
    onClick 
  }: { 
    category: Category | null
    isActive: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      )}
    >
      {category ? category.title : 'All'}
    </button>
  )

  return (
    <div className={cn('space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Category Filter */}
        {showCategoryFilter && categories.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <CategoryButton
              category={null}
              isActive={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            />
            {categories.map(category => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200 w-full sm:w-80"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {filteredPosts.length === initialPosts.length
            ? `${filteredPosts.length} articles`
            : `${filteredPosts.length} of ${initialPosts.length} articles`}
          {maxPosts && maxPosts < initialPosts.length && (
            <span className="ml-1">(limited to {maxPosts})</span>
          )}
        </p>
        
        {(selectedCategory || searchTerm) && (
          <button
            onClick={() => {
              setSelectedCategory(null)
              setSearchTerm('')
            }}
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Posts Grid - Fixed uniform grid */}
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
              className="mx-auto h-16 w-16 text-gray-600 dark:text-gray-400 mb-4"
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
            <h3 className="text-lg font-semibold text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria."
                : "There are no articles to display at the moment."}
            </p>
          </div>
        </div>
      )}

      {/* Load More (for future implementation) */}
      {filteredPosts.length >= 12 && (
        <div className="text-center pt-8">
          <button className="px-8 py-3 bg-gray-800/50 dark:bg-gray-700/50 text-white rounded-lg hover:bg-gray-700/70 dark:hover:bg-gray-600/70 transition-colors duration-200 font-medium backdrop-blur-sm border border-gray-600/30">
            Load More Articles
          </button>
        </div>
      )}
    </div>
  )
}