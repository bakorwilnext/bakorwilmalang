'use client'

import React from 'react'
import { Share2, Facebook, MessageCircle, Send, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
  className?: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  description = '',
  className = ''
}) => {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    instagram: ''
  }

  const handleShare = (platform: string) => {
    if (platform === 'instagram') {
      navigator.clipboard.writeText(`${title} - ${url}`)
      alert('Link copied to clipboard! You can now paste it in Instagram.')
      return
    }

    const shareUrl = shareLinks[platform as keyof typeof shareLinks]
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    }
  }

  const [showNativeShare, setShowNativeShare] = React.useState(false)

  React.useEffect(() => {
    setShowNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Share2 className="h-5 w-5" />
        Bagikan Artikel Ini
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {showNativeShare && (
          <Button
            onClick={handleNativeShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}

        <Button
          onClick={() => handleShare('facebook')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </Button>

        <Button
          onClick={() => handleShare('twitter')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400"
        >
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X (Twitter)
        </Button>

        <Button
          onClick={() => handleShare('whatsapp')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300"
        >
          <MessageCircle className="h-4 w-4 text-green-600" />
          WhatsApp
        </Button>

        <Button
          onClick={() => handleShare('telegram')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400"
        >
          <Send className="h-4 w-4 text-blue-500" />
          Telegram
        </Button>

        <Button
          onClick={() => handleShare('instagram')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300"
        >
          <Instagram className="h-4 w-4 text-pink-600" />
          Instagram
        </Button>
      </div>

      {/* <p className="text-sm text-gray-600 dark:text-gray-400">
        Share this post with your friends and followers
      </p> */}
    </div>
  )
}