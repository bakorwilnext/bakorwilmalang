import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
      content: true,
      updatedAt: true,
      createdAt: true,
    },
  })

  // Fetch all categories for the filter
  const fetchedCategories = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      
      {/* Header Section - Consistent with Archive Block */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Posts
          </h1>
        </div>
      </div>

      {/* Page Range Info */}
      <div className="container mx-auto px-4 mb-8 text-center">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      {/* Collection Archive with consistent styling */}
      <div className="container mx-auto px-4">
        <CollectionArchive 
          posts={posts.docs} 
          categories={fetchedCategories.docs}
          showCategoryFilter={true}
          showSearch={true}
        />
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 mt-12">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Bakorwil III Malang Website Posts`,
  }
}