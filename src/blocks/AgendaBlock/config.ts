import type { Block } from 'payload'

export const AgendaBlock: Block = {
  slug: 'agendaBlock',
  interfaceName: 'AgendaBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Agenda',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: {
        description: 'Jumlah agenda yang ditampilkan',
      },
    },
  ],
}