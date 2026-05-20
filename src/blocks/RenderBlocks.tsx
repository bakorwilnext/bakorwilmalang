import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { InternshipsBlock } from '@/blocks/InternshipsBlock/Component'
import { AnalyticsBlock } from '@/blocks/AnalyticsBlock/Component'
import { ServicesBlock } from '@/blocks/ServicesBlock/Component'
import { default as AgendaBlock } from './AgendaBlock/Component'

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

// Blocks with full-width backgrounds that should render flush (no outer margin)
const flushBlocks = new Set(['servicesBlock'])

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
              const isFlush = flushBlocks.has(blockType)
              return (
                <div className={isFlush ? '' : 'my-16'} key={index}>
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
