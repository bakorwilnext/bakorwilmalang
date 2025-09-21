import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const formData = await request.formData()
    const file = formData.get('file') as File
    const formSubmissionId = formData.get('formSubmissionId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer for Payload
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Create the PDF document with proper file structure for Payload
    const result = await payload.create({
      collection: 'pdfs',
      data: {
        title: file.name,
        uploadedBy: 'Form Submission',
        formSubmissionId: formSubmissionId || 'pending', // Link to form submission
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      } as any,
    })

    return NextResponse.json({ 
      doc: {
        id: result.id,
        filename: result.filename,
        filesize: result.filesize,
        mimeType: result.mimeType,
        url: result.url,
        title: result.title || file.name
      }
    })
  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const url = new URL(request.url)
    
    // Check authentication
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the where clause from query parameters
    const whereParam = url.searchParams.get('where[id][in][0]')
    
    if (!whereParam) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 })
    }

    let pdf
    try {
      // Get the PDF document first
      pdf = await payload.findByID({
        collection: 'pdfs',
        id: whereParam,
      })
    } catch (findError) {
      console.log('PDF not found in database:', whereParam)
      // If PDF is not in database, return empty docs array (Payload format)
      return NextResponse.json({ 
        docs: [],
        totalDocs: 0,
        limit: 0,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      })
    }

    // Delete the physical file if it exists
    if (pdf && pdf.filename) {
      const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
          console.log(`Successfully deleted PDF file: ${pdf.filename}`)
        } catch (fileError) {
          const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown file error'
          console.warn(`Failed to delete PDF file: ${pdf.filename}`, errorMessage)
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database using Payload's delete method
    try {
      const result = await payload.delete({
        collection: 'pdfs',
        id: whereParam,
      })

      // Return the result in a format that matches what Payload's admin expects
      // This should be just the deleted document, not wrapped in a docs array
      return NextResponse.json(result)
      
    } catch (deleteError) {
      const errorMessage = deleteError instanceof Error ? deleteError.message : 'Unknown deletion error'
      console.error('Database deletion error:', errorMessage)
      return NextResponse.json({ 
        errors: [{ message: errorMessage }]
      }, { status: 500 })
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('PDF deletion error:', errorMessage)
    return NextResponse.json({ 
      errors: [{ message: errorMessage }]
    }, { status: 500 })
  }
}