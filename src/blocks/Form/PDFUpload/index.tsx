import type { PDFUploadField } from './type'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import React, { useState, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Simple className utility if cn is not available
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

import { Error } from '../Error'
import { Width } from '../Width'

export const PDFUpload: React.FC<
  PDFUploadField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ 
  name, 
  control, 
  errors, 
  label, 
  required, 
  width, 
  acceptedFileTypes = '.pdf',
  maxFileSize = 10,
  helpText 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const acceptedTypes = acceptedFileTypes.split(',').map(type => type.trim().toLowerCase())
    
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type ${fileExtension} is not accepted. Allowed types: ${acceptedFileTypes}`
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      return `File size (${fileSizeMB.toFixed(1)}MB) exceeds the maximum limit of ${maxFileSize}MB`
    }

    return null
  }, [acceptedFileTypes, maxFileSize])

  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      setIsUploading(true)
      const response = await fetch('/api/pdfs', {
        method: 'POST',
        body: formData,
      })

      // if (!response.ok) {
      //   throw new Error(`Upload failed: ${response.statusText}`)
      // }

      const result = await response.json()
      
      // Return the complete document data for form submission
      return {
        id: result.doc.id,
        filename: result.doc.filename || file.name,
        filesize: result.doc.filesize || file.size,
        mimeType: result.doc.mimeType || file.type,
        url: result.doc.url || `/pdfs/${result.doc.filename}`,
        title: result.doc.title || file.name
      }
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent, onChange: (value: any) => void) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setUploadError(null)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      const error = validateFile(file)
      
      if (error) {
        setUploadError(error)
        return
      }

      const uploadResult = await uploadFile(file)
      if (uploadResult) {
        // Store as JSON string for form submission compatibility
        const pdfData = JSON.stringify(uploadResult)
        onChange(pdfData)
      } else {
        setUploadError('Upload failed. Please try again.')
      }
    }
  }, [validateFile, uploadFile])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    setUploadError(null)
    
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const error = validateFile(file)
      
      if (error) {
        setUploadError(error)
        return
      }

      const uploadResult = await uploadFile(file)
      if (uploadResult) {
        // Store as JSON string for form submission compatibility
        const pdfData = JSON.stringify(uploadResult)
        onChange(pdfData)
      } else {
        setUploadError('Upload failed. Please try again.')
      }
    }
  }, [validateFile, uploadFile])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <Width width={width}>
      <Label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {helpText && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {helpText}
        </p>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          // Parse the field value if it's a JSON string
          let parsedValue = null
          if (field.value) {
            try {
              parsedValue = typeof field.value === 'string' ? JSON.parse(field.value) : field.value
            } catch (error) {
              console.error('Error parsing PDF data:', error)
            }
          }

          return (
          <div className="space-y-3">
            {!parsedValue ? (
              <div
                className={cn(
                  'relative border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                  dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
                  uploadError ? 'border-red-500' : ''
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, field.onChange)}
              >
                <input
                  type="file"
                  id={name}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept={acceptedFileTypes}
                  onChange={(e) => handleFileSelect(e, field.onChange)}
                  disabled={isUploading}
                />
                
                <div className="flex flex-col items-center">
                  {isUploading ? (
                    <>
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drop your PDF here or{' '}
                        <span className="text-blue-500 font-medium">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Max size: {maxFileSize}MB • Accepted: {acceptedFileTypes}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {parsedValue.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(parsedValue.filesize)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => field.onChange(null)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center p-3 text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
          </div>
        )
        }}
        rules={{ required }}
      />
      
      <div className="min-h-[24px]">
        {required && errors[name] && <Error name={name} />}
      </div>
    </Width>
  )
}