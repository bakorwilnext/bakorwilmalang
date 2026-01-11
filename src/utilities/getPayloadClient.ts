import { getPayload } from 'payload'
import config from '@payload-config'
import { importMap } from '@/app/(payload)/admin/importMap'

/**
 * Get Payload instance with proper config and importMap for Payload CMS 3.70+
 * Use this instead of importing getPayload and config directly
 */
export async function getPayloadClient() {
  return await getPayload({ config, importMap })
}
