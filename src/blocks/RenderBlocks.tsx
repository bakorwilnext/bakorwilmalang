import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'

import type { Page } from '@/payload-types'

const ArchiveBlock = dynamic(() => import('@/blocks/ArchiveBlock/Component').then(m => m.ArchiveBlock))
const CallToActionBlock = dynamic(() => import('@/blocks/CallToAction/Component').then(m => m.CallToActionBlock))
const ContentBlock = dynamic(() => import('@/blocks/Content/Component').then(m => m.ContentBlock))
const FormBlock = dynamic(() => import('@/blocks/Form/Component').then(m => m.FormBlock))
const MediaBlock = dynamic(() => import('@/blocks/MediaBlock/Component').then(m => m.MediaBlock))
const InternshipsBlock = dynamic(() => import('@/blocks/InternshipsBlock/Component').then(m => m.InternshipsBlock))
const AnalyticsBlock = dynamic(() => import('@/blocks/AnalyticsBlock/Component').then(m => m.AnalyticsBlock))
const ServicesBlock = dynamic(() => import('@/blocks/ServicesBlock/Component').then(m => m.ServicesBlock))
const AgendaBlock = dynamic(() => import('./AgendaBlock/Component'))

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  internshipsBlock: InternshipsBlock, 
  analyticsBlock: AnalyticsBlock,     
  servicesBlock: ServicesBlock,
  agendaBlock: AgendaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
