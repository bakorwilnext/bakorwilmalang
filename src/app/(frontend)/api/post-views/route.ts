import { getPayloadClient } from '@/utilities/getPayloadClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    const post = result.docs[0]

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const currentViews = (post.viewCount as number) || 0
    const newViewCount = currentViews + 1

    await payload.update({
      collection: 'posts',
      id: post.id,
      data: {
        viewCount: newViewCount,
      },
    })

    return NextResponse.json({ viewCount: newViewCount }, { status: 200 })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      select: {
        viewCount: true,
      },
    })

    const post = result.docs[0]

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ viewCount: (post.viewCount as number) || 0 }, { status: 200 })
  } catch (error) {
    console.error('Error fetching view count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
