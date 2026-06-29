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
      name: 'school',
      type: 'text',
      label: 'School/Campus Origin',
      required: true,
      admin: {
        placeholder: 'e.g., University of Indonesia',
      },
    },
    {
      name: 'faculty',
      type: 'text',
      label: 'Faculty',
      required: true,
      admin: {
        placeholder: 'e.g., Faculty of Computer Science',
      },
    },
    {
      name: 'studyProgram',
      type: 'text',
      label: 'Study Program (Prodi)',
      required: true,
      admin: {
        placeholder: 'e.g., Information Systems',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Internship Start Date',
      required: true,
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
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      validate: (value, { siblingData }) => {
        if (value && siblingData && typeof siblingData === 'object' && 'startDate' in siblingData) {
          const startDate = new Date(siblingData.startDate as string)
          const endDate = new Date(value)
          
          if (endDate <= startDate) {
            return 'End date must be after start date'
          }
        }
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
          defaultValue: 'upload',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload PDF',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'upload',
          },
          validate: (value: any, { siblingData }: { siblingData: any }) => {
            if (siblingData && typeof siblingData === 'object' && 'type' in siblingData && siblingData.type === 'upload' && !value) {
              return 'Please upload the acceptance letter PDF'
            }
            return true
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
          validate: (value: any, { siblingData }: { siblingData: any }) => {
            if (siblingData && typeof siblingData === 'object' && 'type' in siblingData && siblingData.type === 'link') {
              if (!value) {
                return 'Please provide the acceptance letter URL'
              }
              // Basic URL validation
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
      name: 'department',
      type: 'text',
      label: 'Department/Division',
      admin: {
        placeholder: 'e.g., IT Department, Marketing, HR',
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
        if (data.startDate && data.endDate) {
          const now = new Date()
          const startDate = new Date(data.startDate)
          const endDate = new Date(data.endDate)
          
          // Reset time to compare dates only
          now.setHours(0, 0, 0, 0)
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(0, 0, 0, 0)
          
          if (now < startDate) {
            data.status = 'upcoming'
          } else if (now >= startDate && now <= endDate) {
            data.status = 'current'
          } else {
            data.status = 'completed'
          }
        }
        
        return data
      },
    ],
    afterRead: [
      ({ doc }: { doc: any }) => {
        // Recalculate status on read to ensure it's always current
        if (doc.startDate && doc.endDate) {
          const now = new Date()
          const startDate = new Date(doc.startDate)
          const endDate = new Date(doc.endDate)
          
          // Reset time to compare dates only
          now.setHours(0, 0, 0, 0)
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(0, 0, 0, 0)
          
          if (now < startDate) {
            doc.status = 'upcoming'
          } else if (now >= startDate && now <= endDate) {
            doc.status = 'current'
          } else {
            doc.status = 'completed'
          }
        }
        
        return doc
      },
    ],
  },
}