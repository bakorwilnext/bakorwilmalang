export interface PDFUploadField {
  blockName?: string
  blockType: 'pdfUpload'
  acceptedFileTypes?: string
  maxFileSize?: number
  helpText?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}