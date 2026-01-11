import type { Internship, InternshipsBlock as InternshipsBlockProps } from '@/payload-types'
import { getPayloadClient } from '@/utilities/getPayloadClient'
import React from 'react'
import RichText from '@/components/RichText'
import { InternshipsTable } from '@/components/InternshipsTable'
import { InternshipAnalytics } from '@/components/InternshipAnalytics'

export const InternshipsBlock: React.FC<
  InternshipsBlockProps & {
    id?: string
  }
> = async (props) => {
  const { 
    id, 
    introContent, 
    showStatus = 'all',
    showSearch = true,
    showPagination = true,
    itemsPerPage = 10,
    title,
    showAnalytics = false,
    showExport = true
  } = props

  const payload = await getPayloadClient()

  // Build query conditions based on showStatus
  let whereCondition = {}
  if (showStatus !== 'all') {
    whereCondition = {
      status: {
        equals: showStatus,
      },
    }
  }

  const fetchedInternships = await payload.find({
    collection: 'internships',
    depth: 2, // To populate media files
    where: whereCondition,
    sort: '-startDate', // Default sort by start date (newest first)
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

        {showAnalytics && (
          <div className="mb-8">
            <InternshipAnalytics 
              internships={internships}
              showCharts={true}
            />
          </div>
        )}
        
        <InternshipsTable
            internships={internships}
            showStatus={showStatus || 'all'}
            showSearch={Boolean(showSearch)}
            showPagination={Boolean(showPagination)}
            itemsPerPage={itemsPerPage || 10} // Provide default if null
            showExport={Boolean(showExport)}
        />
      </div>
    </div>
  )
}