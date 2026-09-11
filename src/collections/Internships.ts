import type { CollectionConfig } from 'payload'
import { adminOrEditor } from '../access/adminOrEditor'
import { adminOnly } from '../access/adminOnly'

interface InternshipData {
  startDate: string
  endDate: string
  status: 'upcoming' | 'current' | 'completed'
  type?: 'upload' | 'link'
}

export const Internships: CollectionConfig = {
  slug: 'internships',
  labels: {
    singular: 'Internship',
    plural: 'Internships',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'school', 'faculty', 'startDate', 'endDate', 'status'],
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      admin: {
        placeholder: 'Enter intern full name',
      },
    },
    {
      name: 'nim',
      type: 'text',
      label: 'NIM / NIS',
      admin: {
        placeholder: 'e.g., 210412624005',
      },
    },
    {
      name: 'school',
      type: 'text',
      label: 'School/Campus Origin',
      required: false,
      admin: {
        placeholder: 'e.g., University of Indonesia',
      },
    },
    {
      name: 'faculty',
      type: 'text',
      label: 'Faculty',
      required: false,
      admin: {
        placeholder: 'e.g., Faculty of Computer Science',
      },
    },
    {
      name: 'studyProgram',
      type: 'text',
      label: 'Study Program (Prodi)',
      required: false,
      admin: {
        placeholder: 'e.g., Information Systems',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Internship Start Date',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Internship End Date',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      validate: (value, { siblingData }) => {
        return true
      },
    },
    {
      name: 'acceptanceLetter',
      type: 'group',
      label: 'Acceptance Letter',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Type',
          options: [
            {
              label: 'PDF Upload',
              value: 'upload',
            },
            {
              label: 'External Link',
              value: 'link',
            },
          ],
          defaultValue: 'link',
          required: false,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload PDF',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'upload',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'External Link',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
            placeholder: 'https://example.com/acceptance-letter.pdf',
          },
          validate: (value: any) => {
            if (value) {
              try {
                new URL(value as string)
              } catch {
                return 'Please provide a valid URL'
              }
            }
            return true
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Internship Status',
      options: [
        {
          label: 'Upcoming',
          value: 'upcoming',
        },
        {
          label: 'Current',
          value: 'current',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      defaultValue: 'upcoming',
      required: true,
      admin: {
        description: 'This is automatically calculated based on start and end dates',
        readOnly: true,
      },
    },
    {
      name: 'supervisor',
      type: 'text',
      label: 'Supervisor Name',
      admin: {
        placeholder: 'Name of the intern supervisor',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      admin: {
        placeholder: 'Any additional information about the internship',
        rows: 4,
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
      admin: {
        placeholder: 'intern@email.com',
      },
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Contact Phone',
      admin: {
        placeholder: '+62 xxx xxxx xxxx',
      },
    },
    // New fields for analytics
    {
      name: 'rating',
      type: 'number',
      label: 'Performance Rating',
      min: 1,
      max: 5,
      admin: {
        description: 'Rate intern performance from 1-5 (only for completed internships)',
        condition: (_, siblingData) => siblingData?.status === 'completed',
      },
    },
    {
      name: 'completionCertificate',
      type: 'upload',
      relationTo: 'media',
      label: 'Completion Certificate',
      admin: {
        description: 'Upload completion certificate (only for completed internships)',
        condition: (_, siblingData) => siblingData?.status === 'completed',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }: { data: any }) => {
        // Automatically calculate status based on dates
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        if (data.startDate && data.endDate) {
          const startDate = new Date(data.startDate)
          const endDate = new Date(data.endDate)
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(0, 0, 0, 0)

          if (now < startDate) {
            data.status = 'upcoming'
          } else if (now >= startDate && now <= endDate) {
            data.status = 'current'
          } else {
            data.status = 'completed'
          }
        } else if (data.endDate) {
          const endDate = new Date(data.endDate)
          endDate.setHours(0, 0, 0, 0)
          data.status = now > endDate ? 'completed' : 'current'
        } else if (data.startDate) {
          const startDate = new Date(data.startDate)
          startDate.setHours(0, 0, 0, 0)
          data.status = now < startDate ? 'upcoming' : 'current'
        } else {
          data.status = data.status || 'completed'
        }

        return data
      },
    ],
    afterRead: [
      ({ doc }: { doc: any }) => {
        // Recalculate status on read to ensure it's always current
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        if (doc.startDate && doc.endDate) {
          const startDate = new Date(doc.startDate)
          const endDate = new Date(doc.endDate)
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(0, 0, 0, 0)

          if (now < startDate) {
            doc.status = 'upcoming'
          } else if (now >= startDate && now <= endDate) {
            doc.status = 'current'
          } else {
            doc.status = 'completed'
          }
        } else if (doc.endDate) {
          const endDate = new Date(doc.endDate)
          endDate.setHours(0, 0, 0, 0)
          doc.status = now > endDate ? 'completed' : 'current'
        } else if (doc.startDate) {
          const startDate = new Date(doc.startDate)
          startDate.setHours(0, 0, 0, 0)
          doc.status = now < startDate ? 'upcoming' : 'current'
        }

        return doc
      },
    ],
  },
}