import { getPayloadClient } from '@/utilities/getPayloadClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'comments',
      where: {
        post: { equals: postId },
        status: { equals: 'approved' },
      },
      sort: '-createdAt',
      limit: 100,
      depth: 1,
    })

    return NextResponse.json({ comments: result.docs }, { status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { post, authorName, authorEmail, body, parentComment } = await request.json()

    if (!post || !authorName || !authorEmail || !body) {
      return NextResponse.json(
        { error: 'post, authorName, authorEmail, and body are required' },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (body.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'comments',
      data: {
        post,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim().toLowerCase(),
        body: body.trim(),
        status: 'pending' as const,
        ...(parentComment ? { parentComment } : {}),
      },
    })

    return NextResponse.json(
      { message: 'Komentar berhasil dikirim dan sedang menunggu persetujuan.' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
