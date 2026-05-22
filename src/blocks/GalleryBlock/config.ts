import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Galeri Foto',
    plural: 'Galeri Foto',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Judul',
          defaultValue: 'Galeri Foto',
          admin: {
            width: '60%',
            placeholder: 'contoh: Galeri Kegiatan',
          },
        },
        {
          name: 'columns',
          type: 'select',
          label: 'Jumlah Kolom',
          defaultValue: '3',
          options: [
            { label: '2 Kolom', value: '2' },
            { label: '3 Kolom', value: '3' },
            { label: '4 Kolom', value: '4' },
          ],
          admin: {
            width: '40%',
          },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Foto',
      minRows: 1,
      labels: {
        singular: 'Foto',
        plural: 'Foto',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Gambar',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Keterangan (opsional)',
          admin: {
            placeholder: 'contoh: Kunjungan Kerja ke Kabupaten Malang',
          },
        },
      ],
    },
  ],
}
