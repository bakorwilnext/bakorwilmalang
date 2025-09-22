import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Agenda: CollectionConfig = {
  slug: 'agenda',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    startDate: true,
    endDate: true,
    category: true,
  },
  admin: {
    defaultColumns: ['title', 'category', 'startDate', 'location', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Event title...',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        placeholder: 'Event description...',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Events',
          value: 'events',
        },
        {
          label: 'Classes',
          value: 'classes',
        },
        {
          label: 'Performances',
          value: 'performances',
        },
        {
          label: 'Workshops',
          value: 'workshops',
        },
      ],
      defaultValue: 'events',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        placeholder: 'Event location...',
      },
    },
    {
      name: 'instructor',
      type: 'text',
      admin: {
        placeholder: 'Instructor name...',
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}