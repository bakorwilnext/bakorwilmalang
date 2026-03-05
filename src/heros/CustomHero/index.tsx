import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CustomHeroClient } from './CustomHeroClient'

export const CustomHero: React.FC<Page['hero']> = (props) => {
  const { richText, ...rest } = props

  const richTextContent = richText ? (
    <RichText
      className="[&_h1]:text-5xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:drop-shadow-md [&_p]:text-2xl [&_p]:max-w-3xl [&_p]:mx-auto [&_p]:drop-shadow-sm"
      data={richText}
      enableGutter={false}
    />
  ) : null

  return <CustomHeroClient {...rest} richTextContent={richTextContent} />
}