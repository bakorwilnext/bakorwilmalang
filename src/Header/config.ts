import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload a logo image. If not provided, the default logo will be used.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'hasDropdown',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable dropdown menu for this navigation item',
          },
        },
        {
          name: 'dropdownItems',
          type: 'array',
          label: 'Dropdown Menu Items',
          admin: {
            condition: (data, siblingData) => siblingData.hasDropdown,
            description: 'Add items to show in the dropdown menu',
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}