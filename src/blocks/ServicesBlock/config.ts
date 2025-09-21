import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ServicesBlock: Block = {
  slug: 'servicesBlock',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services Block',
    plural: 'Services Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Section Title',
          required: false,
          admin: {
            width: '50%',
            placeholder: 'e.g., Our Services',
          },
        },
        {
          name: 'sectionSubtitle',
          type: 'text',
          label: 'Section Subtitle',
          required: false,
          admin: {
            width: '50%',
            placeholder: 'e.g., What we offer to help you succeed',
          },
        },
      ],
    },
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Introduction Content',
      required: false,
      admin: {
        description: 'Optional rich text content to display below the section title and subtitle',
      },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 1,
      maxRows: 20,
      labels: {
        singular: 'Service',
        plural: 'Services',
      },
      admin: {
        description: 'Add the services you want to showcase. On mobile, 2 cards per row will be displayed.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Service Image',
          admin: {
            description: 'Upload an image that represents this service. Recommended aspect ratio: 4:3 or 3:2',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Service Title',
              admin: {
                width: '60%',
                placeholder: 'e.g., Web Development',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              required: false,
              label: 'Service Subtitle',
              admin: {
                width: '40%',
                placeholder: 'e.g., Professional & Modern',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          label: 'Service Description',
          admin: {
            placeholder: 'Brief description of the service (keep it concise for better mobile display)',
            rows: 3,
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Optional Link',
          admin: {
            description: 'Add a link to make this service card clickable',
          },
          fields: [
            {
              name: 'type',
              type: 'radio',
              label: 'Link Type',
              options: [
                {
                  label: 'Internal Link (to a page or post)',
                  value: 'reference',
                },
                {
                  label: 'External URL',
                  value: 'custom',
                },
              ],
              defaultValue: 'reference',
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
              label: 'Document to Link to',
              maxDepth: 1,
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'reference',
                description: 'Select a page or post to link to',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'External URL',
              required: false,
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'custom',
                placeholder: 'https://example.com',
                description: 'Enter the complete URL including https://',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
              admin: {
                description: 'Check this to open the link in a new browser tab',
              },
            },
          ],
        },
      ],
    },
  ],
  // admin: {
  //   preview: (doc) => {
  //     const servicesCount = doc?.services?.length || 0
  //     const title = doc?.sectionTitle || 'Services Block'
  //     return `${title} (${servicesCount} service${servicesCount !== 1 ? 's' : ''})`
  //   },
  // },
}