import type { CollectionConfig } from 'payload'
import { adminOrEditor } from '../../access/adminOrEditor'
import { adminOnly } from '../../access/adminOnly'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Agenda: CollectionConfig = {
  slug: 'agenda',
  access: {
    create: adminOrEditor,
    delete: adminOnly,
    read: authenticatedOrPublished,
    update: adminOrEditor,
  },
  defaultPopulate: {
    title: true,
    startDate: true,
    endDate: true,
    location: true,
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
      index: true,                            
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
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },                                      
  hooks: {
    beforeChange: [
      ({ data }) => {                                              
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