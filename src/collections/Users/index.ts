import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { protectRoles } from './hooks/protectRoles'
import editor from './access/editor'
import admin from './access/admin'
import user from './access/user'
import { checkRole } from './access/checkRole'
import { User } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: admin,
    delete: admin,
    read: user,
    update: editor,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        {label: 'Admin', value: 'admin'},
        {label: 'Editor', value: 'editor'},
        {label: 'User', value: 'user'}
      ],
      hooks: {
        beforeChange: [protectRoles]
      },
      access: {
        update: ({req: {user}}) => checkRole(['admin'], user as User)
      }
    },
  ],
  timestamps: true,
}
