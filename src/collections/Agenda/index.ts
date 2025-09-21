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
    defaultColumns: ['title', 'category', 'startDate', 'endDate', 'updatedAt'],
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
          label: 'All',
          value: 'all',
        },
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
    {
      name: 'isAllDay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isRecurring',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'recurringPattern',
      type: 'select',
      admin: {
        condition: (data) => data.isRecurring,
      },
      options: [
        {
          label: 'Daily',
          value: 'daily',
        },
        {
          label: 'Weekly',
          value: 'weekly',
        },
        {
          label: 'Monthly',
          value: 'monthly',
        },
      ],
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'cyan',
      options: [
        {
          label: 'Cyan',
          value: 'cyan',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Green',
          value: 'green',
        },
        {
          label: 'Purple',
          value: 'purple',
        },
        {
          label: 'Pink',
          value: 'pink',
        },
        {
          label: 'Yellow',
          value: 'yellow',
        },
        {
          label: 'Red',
          value: 'red',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
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