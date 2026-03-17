'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { MessageCircle, Send, Clock, User, ChevronDown, ChevronUp } from 'lucide-react'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
  parentComment?: { id: string } | string | null
}

interface CommentsSectionProps {
  postId: string
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showAllComments, setShowAllComments] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments)
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: postId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          body: body.trim(),
          parentComment: replyTo,
        }),
      })

      if (res.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Komentar berhasil dikirim! Menunggu persetujuan admin.',
        })
        setAuthorName('')
        setAuthorEmail('')
        setBody('')
        setReplyTo(null)
      } else {
        const data = await res.json()
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Gagal mengirim komentar.',
        })
      }
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Terjadi kesalahan. Silakan coba lagi.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const topLevelComments = comments.filter((c) => !c.parentComment)
  const getReplies = (commentId: string) =>
    comments.filter((c) => {
      if (!c.parentComment) return false
      if (typeof c.parentComment === 'string') return c.parentComment === commentId
      return c.parentComment?.id === commentId
    })

  const visibleComments = showAllComments ? topLevelComments : topLevelComments.slice(0, 5)

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''} mb-4`}
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {comment.authorName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>
        <button
          type="button"
          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
          className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {replyTo === comment.id ? 'Batal balas' : 'Balas'}
        </button>
      </div>

      {replyTo === comment.id && (
        <div className="mt-2 ml-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nama"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <textarea
              placeholder="Tulis balasan..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-3 h-3" />
              {isSubmitting ? 'Mengirim...' : 'Kirim Balasan'}
            </button>
          </form>
        </div>
      )}

      {getReplies(comment.id).map((reply) => renderComment(reply, true))}
    </div>
  )

  return (
    <div className="max-w-[48rem] mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Komentar
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({comments.length})
          </span>
        )}
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-1">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded mt-3" />
              <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {visibleComments.map((comment) => renderComment(comment))}
              </div>

              {topLevelComments.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {showAllComments ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Sembunyikan
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Lihat semua {topLevelComments.length} komentar
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </>
      )}

      {submitMessage && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            submitMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {submitMessage.type === 'success' && <Clock className="w-4 h-4 flex-shrink-0" />}
          {submitMessage.text}
        </div>
      )}

      {!replyTo && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Tulis Komentar
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama *"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
            <input
              type="email"
              placeholder="Email *"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <textarea
            placeholder="Tulis komentar Anda... *"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Email tidak akan ditampilkan. Komentar akan muncul setelah disetujui admin.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      )}
    </div>
  )
}
