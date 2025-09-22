// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { NextRequest, NextResponse } from 'next/server'

// export async function POST(request: NextRequest) {
//   try {
//     const payload = await getPayload({ config })
//     const { submissionId, pdfIds } = await request.json()

//     if (!submissionId || !pdfIds || !Array.isArray(pdfIds)) {
//       return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
//     }

//     const updatePromises = pdfIds.map((pdfId: string) =>
//       payload.update({
//         collection: 'pdfs',
//         id: pdfId,
//         data: {
//           formSubmissionId: submissionId,
//         },
//       })
//     )

//     await Promise.all(updatePromises)

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error linking PDFs to submission:', error)
//     return NextResponse.json({ error: 'Failed to link PDFs' }, { status: 500 })
//   }
// }