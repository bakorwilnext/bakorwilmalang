import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const AnalyticsBlock: Block = {
  slug: 'analyticsBlock',
  interfaceName: 'AnalyticsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Block Title',
      defaultValue: 'Analytics Dashboard',
      admin: {
        placeholder: 'e.g., Internship Analytics',
      },
    },
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
      admin: {
        description: 'Optional content to display above the analytics',
      },
    },
    {
      name: 'analyticsType',
      type: 'select',
      label: 'Analytics Type',
      defaultValue: 'internships',
      options: [
        {
          label: 'Internships Analytics',
          value: 'internships',
        },
      ],
      admin: {
        description: 'Choose what type of analytics to display',
      },
    },
    {
      name: 'showCharts',
      type: 'checkbox',
      label: 'Show Charts',
      defaultValue: true,
      admin: {
        description: 'Display visual charts and graphs',
      },
    },
  ],
  labels: {
    plural: 'Analytics Blocks',
    singular: 'Analytics Block',
  },
}