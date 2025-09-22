// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { NextRequest, NextResponse } from 'next/server'
// import fs from 'fs'
// import path from 'path'

// export async function POST(request: NextRequest) {
//   try {
//     const payload = await getPayload({ config })
//     const { action, id } = await request.json()

//     const { user } = await payload.auth({ headers: request.headers })
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     if (action === 'cleanup-orphaned') {
//       const pdfs = await payload.find({
//         collection: 'pdfs',
//         limit: 1000,
//         pagination: false,
//       })

//       const orphanedRecords = []
//       const fixedRecords = []

//       for (const pdf of pdfs.docs) {
//         if (pdf.filename) {
//           const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
//           const fileExists = fs.existsSync(filePath)

//           if (!fileExists) {
//             try {
//               await payload.delete({
//                 collection: 'pdfs',
//                 id: pdf.id,
//               })
//               orphanedRecords.push({
//                 id: pdf.id,
//                 filename: pdf.filename,
//                 status: 'deleted_from_db',
//               })
//             } catch (error) {
//               orphanedRecords.push({
//                 id: pdf.id,
//                 filename: pdf.filename,
//                 status: 'failed_to_delete',
//               })
//             }
//           } else {
//             fixedRecords.push({
//               id: pdf.id,
//               filename: pdf.filename,
//               status: 'file_exists',
//             })
//           }
//         }
//       }

//       return NextResponse.json({
//         success: true,
//         orphanedRecords,
//         fixedRecords,
//         message: `Cleanup complete. ${orphanedRecords.length} orphaned records processed, ${fixedRecords.length} valid files found.`,
//       })
//     }

//     if (action === 'force-delete' && id) {
//       try {
//         const pdf = await payload.findByID({
//           collection: 'pdfs',
//           id,
//         })

//         if (pdf.filename) {
//           const filePath = path.join(process.cwd(), 'public', 'pdfs', pdf.filename)
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath)
//           }
//         }

//         await payload.delete({
//           collection: 'pdfs',
//           id,
//         })

//         return NextResponse.json({
//           success: true,
//           message: `PDF ${pdf.filename || id} deleted successfully`,
//         })
//       } catch (error) {
//         return NextResponse.json({
//           success: false,
//         }, { status: 500 })
//       }
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
//   } catch (error) {
//     console.error('PDF cleanup error:', error)
//     return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
//   }
// }