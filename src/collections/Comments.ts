import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Comment',
    plural: 'Comments',
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'status', 'createdAt'],
  },
  access: {
    create: anyone,
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'approved',
        },
      }
    },
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        description: 'The post this comment belongs to',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Author Name',
      admin: {
        placeholder: 'Your name',
      },
    },
    {
      name: 'authorEmail',
      type: 'email',
      required: true,
      label: 'Author Email',
      admin: {
        placeholder: 'your@email.com',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Comment',
      admin: {
        placeholder: 'Write your comment...',
        rows: 4,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only approved comments are visible on the website',
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      label: 'Reply To',
      admin: {
        position: 'sidebar',
        description: 'If this is a reply to another comment',
      },
    },
  ],
  timestamps: true,
}
