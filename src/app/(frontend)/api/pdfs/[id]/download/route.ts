import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    
    const pdf = await payload.findByID({
      collection: 'pdfs',
      id: id,
    })

    if (!pdf || !pdf.filename) {
      return NextResponse.json({ error: 'PDF not found in database' }, { status: 404 })
    }

    // Check if file exists on disk
    const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
    
    if (!fs.existsSync(filePath)) {
      // Log the error
      console.error(`PDF file missing on disk: ${pdf.filename} at ${filePath}`)
      
      // Return a helpful error response
      return NextResponse.json({ 
        error: 'File not found on disk',
        message: `The PDF file "${pdf.filename}" exists in the database but is missing from the server. Please contact support.`,
        filename: pdf.filename,
        expectedPath: filePath
      }, { status: 404 })
    }

    try {
      // Increment download count
      await payload.update({
        collection: 'pdfs',
        id: id,
        data: {
          downloadCount: (pdf.downloadCount || 0) + 1,
        },
      })

      // Serve the file
      const fileBuffer = fs.readFileSync(filePath)
      
      return new NextResponse(fileBuffer as any, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${pdf.filename}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (fileError) {
      console.error('Error reading PDF file:', fileError)
      return NextResponse.json({ 
        error: 'Failed to read file',
        message: 'The file exists but could not be read. It may be corrupted or in use.',
        filename: pdf.filename
      }, { status: 500 })
    }
  } catch (error) {
    console.error('PDF download error:', error)
    return NextResponse.json({ 
      error: 'Download failed',
      message: 'An unexpected error occurred while processing your request.'
    }, { status: 500 })
  }
}