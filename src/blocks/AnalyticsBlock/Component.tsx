import type { Internship, AnalyticsBlock as AnalyticsBlockProps } from '@/payload-types'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import React from 'react'
import RichText from '@/components/RichText'
import { InternshipAnalytics } from '@/components/InternshipAnalytics'

export const AnalyticsBlock: React.FC<
  AnalyticsBlockProps & {
    id?: string
  }
> = async (props) => {
  const { 
    id, 
    introContent,
    title,
    showCharts = true,
    analyticsType = 'internships'
  } = props

  const payload = await getPayloadClient()

  const fetchedInternships = await payload.find({
    collection: 'internships',
    depth: 2,
    sort: '-startDate',
  })

  const internships: Internship[] = fetchedInternships.docs

  return (
    <div className="my-16" id={`block-${id}`}>
      <div className="container">
        {title && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          </div>
        )}
        
        {introContent && (
          <div className="mb-8">
            <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
          </div>
        )}

        {analyticsType === 'internships' && (
          <InternshipAnalytics 
            internships={internships}
            showCharts={Boolean(showCharts)}
          />
        )}
      </div>
    </div>
  )
}