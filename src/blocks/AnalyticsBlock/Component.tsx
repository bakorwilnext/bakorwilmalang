import type { Internship, AnalyticsBlock as AnalyticsBlockProps } from '@/payload-types'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import React from 'react'
import RichText from '@/components/RichText'
import { InternshipAnalytics } from '@/components/InternshipAnalytics'

export const AnalyticsBlock: React.FC<
  AnalyticsBlockProps & { id?: string }
> = async (props) => {
  const { id, introContent, title } = props

  const payload = await getPayloadClient()

  const fetchedInternships = await payload.find({
    collection: 'internships',
    depth: 2,
    limit: 0,
    sort: '-startDate',
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

        <InternshipAnalytics internships={internships} />
      </div>
    </div>
  )
}