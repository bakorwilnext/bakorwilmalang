// import type { CollectionAfterChangeHook } from 'payload'

// export const linkPDFsToSubmission: CollectionAfterChangeHook = async ({
//   doc,
//   req: { payload },
//   operation,
// }) => {
//   if (operation === 'create') {

//     const submissionData = doc.submissionData

//     if (submissionData && Array.isArray(submissionData)) {
//       const pdfUpdates: Promise<any>[] = []


//       submissionData.forEach((field) => {
//         if (field && field.value && typeof field.value === 'string') {
//           try {

//             const parsedValue = JSON.parse(field.value)
            
//             if (parsedValue && parsedValue.id && parsedValue.filename) {

//               const pdfUpdate = payload.update({
//                 collection: 'pdfs',
//                 id: parsedValue.id,
//                 data: {
//                   formSubmissionId: doc.id,
//                   uploadedBy: `Form: ${doc.form?.title || 'Unknown Form'}`,
//                 },
//               }).catch((error) => {
//                 console.error(`Failed to link PDF ${parsedValue.id} to submission ${doc.id}:`, error)
//               })

//               pdfUpdates.push(pdfUpdate)
//             }
//           } catch (error) {

//           }
//         }
//       })


//       if (pdfUpdates.length > 0) {
//         await Promise.all(pdfUpdates)
//         payload.logger.info(`Linked ${pdfUpdates.length} PDFs to form submission ${doc.id}`)
//       }
//     }
//   }

//   return doc
// }