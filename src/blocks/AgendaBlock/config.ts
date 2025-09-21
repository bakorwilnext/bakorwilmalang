import type { Block } from 'payload'

export const AgendaBlock: Block = {
  slug: 'agendaBlock',
  interfaceName: 'AgendaBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Calendar',
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show category filters',
    },
    {
      name: 'defaultView',
      type: 'select',
      defaultValue: 'month',
      options: [
        {
          label: 'Month View',
          value: 'month',
        },
        {
          label: 'Week View',
          value: 'week',
        },
        {
          label: 'Day View',
          value: 'day',
        },
      ],
    },
    {
      name: 'allowedCategories',
      type: 'select',
      hasMany: true,
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
      admin: {
        description: 'Select which categories to show. Leave empty to show all.',
      },
    },
    {
      name: 'showUpcoming',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show upcoming events list',
    },
    {
      name: 'upcomingLimit',
      type: 'number',
      defaultValue: 5,
      admin: {
        condition: (data) => data.showUpcoming,
        description: 'Number of upcoming events to display',
      },
    },
  ],
}