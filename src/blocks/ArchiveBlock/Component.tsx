import type { Post, ArchiveBlock as ArchiveBlockProps, Category } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { 
    id, 
    categories, 
    introContent, 
    limit: limitFromProps, 
    populateBy, 
    selectedDocs,
    showCategoryFilter = true,
    showSearch = true,
    maxPosts = 0
  } = props

  const limit = limitFromProps || 12

  let posts: Post[] = []
  let allCategories: Category[] = []

  const payload = await getPayload({ config: configPromise })

  const fetchedCategories = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
  })
  allCategories = fetchedCategories.docs

  if (populateBy === 'collection') {
    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 2,
      limit,
      sort: '-publishedAt',
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="py-16" id={`block-${id}`}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Artikel
          </h2>
          {introContent && (
            <div className="max-w-3xl mx-auto">
              <RichText 
                className="text-lg text-gray-600 dark:text-gray-400" 
                data={introContent} 
                enableGutter={false} 
              />
            </div>
          )}
        </div>

        <CollectionArchive 
          posts={posts} 
          categories={allCategories}
          showCategoryFilter={showCategoryFilter ?? true}
          showSearch={showSearch ?? true}
          maxPosts={maxPosts && maxPosts > 0 ? maxPosts : undefined}
        />
      </div>
    </div>
  )
}