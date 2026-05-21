import type { Internship, InternshipsBlock as InternshipsBlockProps } from '@/payload-types'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import React from 'react'
import RichText from '@/components/RichText'
import { InternshipsTable } from '@/components/InternshipsTable'
import { InternshipAnalytics } from '@/components/InternshipAnalytics'

export const InternshipsBlock: React.FC<
  InternshipsBlockProps & { id?: string }
> = async (props) => {
  const {
    id,
    introContent,
    showStatus = 'all',
    showSearch = true,
    showPagination = true,
    itemsPerPage = 10,
    title = 'Data Magang',
    showAnalytics = false,
    showExport = true,
  } = props

  const payload = await getPayloadClient()

  const fetchedInternships = await payload.find({
    collection: 'internships',
    depth: 2,
    limit: 0,
    sort: '-startDate',
    ...(showStatus !== 'all' && {
      where: { status: { equals: showStatus } },
    }),
  })

  const internships: Internship[] = fetchedInternships.docs

  return (
    <div className="py-16" id={`block-${id}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {title}
            </h2>
          </div>
        )}

        {introContent && (
          <div className="mb-8">
            <RichText className="ms-0 max-w-3xl" data={introContent} enableGutter={false} />
          </div>
        )}

        {showAnalytics && <InternshipAnalytics internships={internships} />}

        <InternshipsTable
          internships={internships}
          showSearch={Boolean(showSearch)}
          showPagination={Boolean(showPagination)}
          itemsPerPage={itemsPerPage || 10}
          showExport={Boolean(showExport)}
        />
      </div>
    </div>
  )
}