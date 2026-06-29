import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { adminOrEditor } from '../access/adminOrEditor'
import { adminOnly } from '../access/adminOnly'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminOrEditor,
    delete: adminOnly,
    read: anyone,
    update: adminOrEditor,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
