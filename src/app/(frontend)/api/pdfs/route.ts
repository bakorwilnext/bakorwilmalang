// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { NextRequest, NextResponse } from 'next/server'
// import fs from 'fs'
// import path from 'path'

// export async function POST(request: NextRequest) {
//   try {
//     const payload = await getPayload({ config })
//     const formData = await request.formData()
//     const file = formData.get('file') as File
//     const formSubmissionId = formData.get('formSubmissionId') as string

//     if (!file) {
//       return NextResponse.json({ error: 'No file provided' }, { status: 400 })
//     }

//     const buffer = Buffer.from(await file.arrayBuffer())
    
//     const result = await payload.create({
//       collection: 'pdfs',
//       data: {
//         title: file.name,
//         uploadedBy: 'Form Submission',
//         formSubmissionId: formSubmissionId || 'pending',
//       },
//       file: {
//         data: buffer,
//         mimetype: file.type,
//         name: file.name,
//         size: file.size,
//       } as any,
//     })

//     return NextResponse.json({ 
//       doc: {
//         id: result.id,
//         filename: result.filename,
//         filesize: result.filesize,
//         mimeType: result.mimeType,
//         url: result.url,
//         title: result.title || file.name
//       }
//     })
//   } catch (error) {
//     console.error('PDF upload error:', error)
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const payload = await getPayload({ config })
//     const url = new URL(request.url)
    
//     const { user } = await payload.auth({ headers: request.headers })
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const whereParam = url.searchParams.get('where[id][in][0]')
    
//     if (!whereParam) {
//       return NextResponse.json({ error: 'No ID provided' }, { status: 400 })
//     }

//     let pdf
//     try {
//       pdf = await payload.findByID({
//         collection: 'pdfs',
//         id: whereParam,
//       })
//     } catch (findError) {
//       console.log('PDF not found in database:', whereParam)
//       return NextResponse.json({ 
//         docs: [],
//         totalDocs: 0,
//         limit: 0,
//         totalPages: 1,
//         page: 1,
//         pagingCounter: 1,
//         hasPrevPage: false,
//         hasNextPage: false,
//         prevPage: null,
//         nextPage: null
//       })
//     }

//     if (pdf && pdf.filename) {
//       const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
      
//       if (fs.existsSync(filePath)) {
//         try {
//           fs.unlinkSync(filePath)
//           console.log(`Successfully deleted PDF file: ${pdf.filename}`)
//         } catch (fileError) {
//           const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown file error'
//           console.warn(`Failed to delete PDF file: ${pdf.filename}`, errorMessage)
//         }
//       }
//     }

//     try {
//       const result = await payload.delete({
//         collection: 'pdfs',
//         id: whereParam,
//       })

//       return NextResponse.json(result)
      
//     } catch (deleteError) {
//       const errorMessage = deleteError instanceof Error ? deleteError.message : 'Unknown deletion error'
//       console.error('Database deletion error:', errorMessage)
//       return NextResponse.json({ 
//         errors: [{ message: errorMessage }]
//       }, { status: 500 })
//     }

//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error'
//     console.error('PDF deletion error:', errorMessage)
//     return NextResponse.json({ 
//       errors: [{ message: errorMessage }]
//     }, { status: 500 })
//   }
// }