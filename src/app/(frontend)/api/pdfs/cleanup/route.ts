import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { action, id } = await request.json()

    // Authentication check - ensure user is authenticated
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (action === 'cleanup-orphaned') {
      // Find all PDFs in the database
      const pdfs = await payload.find({
        collection: 'pdfs',
        limit: 1000,
        pagination: false,
      })

      const orphanedRecords = []
      const fixedRecords = []

      for (const pdf of pdfs.docs) {
        if (pdf.filename) {
          const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
          const fileExists = fs.existsSync(filePath)

          if (!fileExists) {
            // Delete the database record for missing files
            try {
              await payload.delete({
                collection: 'pdfs',
                id: pdf.id,
              })
              orphanedRecords.push({
                id: pdf.id,
                filename: pdf.filename,
                status: 'deleted_from_db',
              })
            } catch (error) {
              orphanedRecords.push({
                id: pdf.id,
                filename: pdf.filename,
                status: 'failed_to_delete',
                // error: error.message,
              })
            }
          } else {
            fixedRecords.push({
              id: pdf.id,
              filename: pdf.filename,
              status: 'file_exists',
            })
          }
        }
      }

      return NextResponse.json({
        success: true,
        orphanedRecords,
        fixedRecords,
        message: `Cleanup complete. ${orphanedRecords.length} orphaned records processed, ${fixedRecords.length} valid files found.`,
      })
    }

    if (action === 'force-delete' && id) {
      // Force delete a specific PDF record
      try {
        const pdf = await payload.findByID({
          collection: 'pdfs',
          id,
        })

        // Try to delete the file if it exists
        if (pdf.filename) {
          const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }

        // Delete from database
        await payload.delete({
          collection: 'pdfs',
          id,
        })

        return NextResponse.json({
          success: true,
          message: `PDF ${pdf.filename || id} deleted successfully`,
        })
      } catch (error) {
        return NextResponse.json({
          success: false,
        //   error: `Failed to delete PDF: ${error.message}`,
        }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('PDF cleanup error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}