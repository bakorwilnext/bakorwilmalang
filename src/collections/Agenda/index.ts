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
    location: true,
    instructor: true,
  },
  admin: {
    defaultColumns: ['title', 'startDate', 'location', 'updatedAt'],
    useAsTitle: 'title',
    pagination: {
      defaultLimit: 50,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true, // Index for faster queries
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
      name: 'startDate',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      index: true,
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
      name: 'color',
      type: 'text',
      admin: {
        description: 'Optional color for event display',
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
  // Add hooks for performance optimization
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure dates are properly formatted
        if (data.startDate && typeof data.startDate === 'string') {
          data.startDate = new Date(data.startDate).toISOString();
        }
        if (data.endDate && typeof data.endDate === 'string') {
          data.endDate = new Date(data.endDate).toISOString();
        }
        return data;
      },
    ],
  },
}