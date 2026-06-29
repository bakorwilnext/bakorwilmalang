import type { Access } from 'payload'
import { checkRole } from '../collections/Users/access/checkRole'
import type { User } from '@/payload-types'

export const adminOrEditor: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'editor'], user as User)) {
      return true
    }
  }

  return false
}
