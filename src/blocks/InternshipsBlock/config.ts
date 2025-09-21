import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const InternshipsBlock: Block = {
  slug: 'internshipsBlock',
  interfaceName: 'InternshipsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Block Title',
      admin: {
        placeholder: 'e.g., Our Interns',
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
        description: 'Optional content to display above the internships table',
      },
    },
    {
      name: 'showAnalytics',
      type: 'checkbox',
      label: 'Show Analytics Dashboard',
      defaultValue: false,
      admin: {
        description: 'Display analytics and charts above the table',
      },
    },
    {
      name: 'showStatus',
      type: 'select',
      label: 'Show Internships',
      defaultValue: 'all',
      options: [
        {
          label: 'All Internships',
          value: 'all',
        },
        {
          label: 'Current Only',
          value: 'current',
        },
        {
          label: 'Upcoming Only',
          value: 'upcoming',
        },
        {
          label: 'Completed Only',
          value: 'completed',
        },
      ],
      admin: {
        description: 'Filter which internships to display based on their status',
      },
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Show Search Bar',
      defaultValue: true,
      admin: {
        description: 'Allow users to search through the internships',
      },
    },
    {
      name: 'showExport',
      type: 'checkbox',
      label: 'Show Export Buttons',
      defaultValue: true,
      admin: {
        description: 'Show CSV and Excel export buttons',
      },
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      label: 'Show Pagination',
      defaultValue: true,
      admin: {
        description: 'Enable pagination for large lists',
      },
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      label: 'Items Per Page',
      defaultValue: 10,
      min: 5,
      max: 50,
      admin: {
        condition: (_, siblingData) => siblingData?.showPagination,
        description: 'Number of internships to show per page',
      },
    },
  ],
  labels: {
    plural: 'Internships Blocks',
    singular: 'Internships Block',
  },
}