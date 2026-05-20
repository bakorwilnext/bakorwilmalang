import type { Metadata } from 'next/types'

import { getPayloadClient } from '@/utilities/getPayloadClient'
import React from 'react'
import AgendaPageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function AgendaPage() {
  const payload = await getPayloadClient()

  const agenda = await payload.find({
    collection: 'agenda',
    depth: 0,
    limit: 100,
    sort: '-startDate',
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Agenda
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Jadwal kegiatan dan acara resmi Bakorwil III Malang
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <AgendaPageClient items={agenda.docs} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Agenda — Bakorwil III Malang',
    description: 'Jadwal kegiatan dan acara resmi Badan Koordinasi Wilayah III Malang, Pemerintah Provinsi Jawa Timur.',
  }
}
