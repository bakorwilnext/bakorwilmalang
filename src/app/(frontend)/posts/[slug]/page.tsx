import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { ShareButtons } from '@/components/ShareButtons/ShareButtons'
import { ViewCounter } from '@/components/ViewCounter'
import { CommentsSection } from '@/components/CommentsSection'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }: { slug?: string | null }) => {
    return { slug: slug || '' }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />
                        
  const baseUrl = getServerSideURL()
  const fullUrl = `${baseUrl}/posts/${post.slug}`
  const shareDescription = post.meta?.description || `Read "${post.title}" on our website.`

  return (
    <article className="pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />

          <ViewCounter 
            slug={post.slug || ''} 
            initialViews={typeof post.viewCount === 'number' ? post.viewCount : 0}
            className="mt-4 max-w-[48rem] mx-auto"
          />
                                                                  
          <div className="max-w-[48rem] mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <ShareButtons
              title={post.title}
              url={fullUrl}
              description={shareDescription}
              className="mb-6"
            />
            

          </div>

          <CommentsSection postId={post.id} />

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((relatedPost: Post | string): relatedPost is Post => typeof relatedPost === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
