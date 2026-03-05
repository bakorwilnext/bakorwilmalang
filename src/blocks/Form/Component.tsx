import React from 'react'

import RichText from '@/components/RichText'
import { FormBlockClient } from './FormBlockClient'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const { enableIntro, introContent, form, ...rest } = props

  const introRendered = enableIntro && introContent ? (
    <RichText data={introContent} enableGutter={false} />
  ) : null

  const confirmationRendered = form?.confirmationMessage ? (
    <RichText data={form.confirmationMessage} />
  ) : null

  return (
    <FormBlockClient
      {...rest}
      enableIntro={enableIntro}
      form={form}
      introContent={introRendered}
      confirmationContent={confirmationRendered}
    />
  )
}
