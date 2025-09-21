import type { Field, Block } from 'payload'

export const name: Field = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
}

export const label: Field = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
}

export const required: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
}

export const width: Field = {
  name: 'width',
  type: 'number',
  label: 'Field Width (percentage)',
}

export const PDFUpload: Block = {
  slug: 'pdfUpload',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'acceptedFileTypes',
          type: 'text',
          label: 'Accepted File Types',
          defaultValue: '.pdf',
          admin: {
            width: '50%',
            description: 'Comma-separated list of accepted file extensions (e.g., .pdf)',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxFileSize',
          type: 'number',
          label: 'Max File Size (MB)',
          defaultValue: 10,
          admin: {
            width: '50%',
            description: 'Maximum file size in megabytes',
          },
        },
        {
          name: 'helpText',
          type: 'text',
          label: 'Help Text',
          admin: {
            width: '50%',
            placeholder: 'e.g., Upload your resume in PDF format',
          },
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'PDF Upload Fields',
    singular: 'PDF Upload',
  },
}