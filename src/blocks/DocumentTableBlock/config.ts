import type { Block } from 'payload'

export const DocumentTableBlock: Block = {
  slug: 'documentTableBlock',
  interfaceName: 'DocumentTableBlock',
  labels: {
    singular: 'Tabel Dokumen',
    plural: 'Tabel Dokumen',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Section',
      admin: {
        placeholder: 'contoh: Laporan Tahunan',
      },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Kolom',
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'Kolom',
        plural: 'Kolom',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Nama Kolom',
              required: true,
              admin: {
                width: '60%',
                placeholder: 'contoh: Tahun Laporan',
              },
            },
            {
              name: 'type',
              type: 'select',
              label: 'Tipe',
              required: true,
              defaultValue: 'text',
              options: [
                { label: 'Teks', value: 'text' },
                { label: 'Tautan', value: 'link' },
              ],
              admin: {
                width: '40%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Baris Data',
      minRows: 1,
      labels: {
        singular: 'Baris',
        plural: 'Baris',
      },
      fields: [
        {
          name: 'cells',
          type: 'array',
          label: 'Sel',
          labels: {
            singular: 'Sel',
            plural: 'Sel',
          },
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Nilai',
              required: true,
              admin: {
                placeholder: 'contoh: 2025 atau Unduh',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL Tautan',
              admin: {
                placeholder: 'https://...',
                description: 'Isi URL jika kolom ini bertipe "Tautan"',
              },
            },
          ],
        },
      ],
    },
  ],
}
