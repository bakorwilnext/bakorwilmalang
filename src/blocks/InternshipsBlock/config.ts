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
  labels: {
    singular: 'Blok Magang',
    plural: 'Blok Magang',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul',
      defaultValue: 'Data Magang',
      admin: {
        placeholder: 'contoh: Data Magang',
      },
    },
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Konten Pendahuluan',
    },
    {
      name: 'showAnalytics',
      type: 'checkbox',
      label: 'Tampilkan Analitik',
      defaultValue: false,
    },
    {
      name: 'showStatus',
      type: 'select',
      label: 'Filter Status',
      defaultValue: 'all',
      options: [
        { label: 'Semua', value: 'all' },
        { label: 'Aktif', value: 'current' },
        { label: 'Akan Datang', value: 'upcoming' },
        { label: 'Selesai', value: 'completed' },
      ],
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Tampilkan Pencarian',
      defaultValue: true,
    },
    {
      name: 'showExport',
      type: 'checkbox',
      label: 'Tampilkan Tombol Ekspor',
      defaultValue: true,
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      label: 'Tampilkan Pagination',
      defaultValue: true,
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      label: 'Item per Halaman',
      defaultValue: 10,
      min: 5,
      max: 50,
      admin: {
        condition: (_, siblingData) => siblingData?.showPagination,
      },
    },
  ],
}