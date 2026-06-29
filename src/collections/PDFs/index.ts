import type { CollectionConfig } from 'payload'
import { adminOrEditor } from '../../access/adminOrEditor'
import { adminOnly } from '../../access/adminOnly'
import { anyone } from '../../access/anyone'
import fs from 'fs'
import path from 'path'

export const PDFs: CollectionConfig = {
  slug: 'pdfs',
  access: {
    create: anyone, // Allow public uploads from forms
    delete: adminOnly,
    read: anyone, // Allow public downloads
    update: adminOrEditor,
  },
  admin: {
    defaultColumns: ['filename', 'title', 'filesize', 'createdAt'],
    useAsTitle: 'filename',
    group: 'Media',
    description: 'PDF files uploaded through forms',
  },
  upload: {
    staticDir: './public/pdfs',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'Enter a descriptive title for this PDF',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        placeholder: 'Brief description of the PDF content',
        rows: 3,
      },
    },
    {
      name: 'uploadedBy',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'formSubmissionId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'ID of the form submission this PDF belongs to',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set initial download count for new uploads
        if (operation === 'create' && !data.downloadCount) {
          data.downloadCount = 0
        }
        return data
      },
    ],
  },
}