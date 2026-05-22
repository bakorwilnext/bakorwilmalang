import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'mapBlock',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Peta Google Maps',
    plural: 'Peta Google Maps',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul',
      admin: {
        placeholder: 'contoh: Peta Wilayah Kerja',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      label: 'URL Embed Google Maps',
      required: true,
      admin: {
        placeholder: 'https://www.google.com/maps/d/embed?mid=...',
        description: 'Salin URL embed dari Google Maps (format: https://www.google.com/maps/d/embed?...)',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Tinggi Peta',
      defaultValue: '500',
      options: [
        { label: 'Kecil (350px)', value: '350' },
        { label: 'Sedang (500px)', value: '500' },
        { label: 'Besar (650px)', value: '650' },
        { label: 'Sangat Besar (800px)', value: '800' },
      ],
    },
  ],
}
