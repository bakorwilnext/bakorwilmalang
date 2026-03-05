import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { HighImpactHeroClient } from './HighImpactHeroClient'

export const HighImpactHero: React.FC<Page['hero']> = (props) => {
  const { richText, ...rest } = props

  const richTextContent = richText ? (
    <RichText data={richText} enableGutter={false} />
  ) : null

  return <HighImpactHeroClient {...rest} richTextContent={richTextContent} />
}
