// Create this as src/blocks/Form/Upload/index.tsx
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

interface UploadFieldProps {
  name: string
  label?: string
  required?: boolean
  width?: string | number
  errors: Partial<FieldErrorsImpl>
  register: UseFormRegister<FieldValues>
}

export const Upload: React.FC<UploadFieldProps> = ({ 
  name, 
  errors, 
  label, 
  register, 
  required, 
  width
}) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input
        accept="application/pdf,.pdf"
        id={name}
        type="file"
        {...register(name, { 
          required,
          validate: {
            fileType: (files: any) => {
              if (!files || files.length === 0) return true
              const file = files[0]
              if (file && file.type !== 'application/pdf') {
                return 'Please select a PDF file only'
              }
              return true
            },
            fileSize: (files: any) => {
              if (!files || files.length === 0) return true
              const file = files[0]
              const maxSize = 10 * 1024 * 1024 // 10MB
              if (file && file.size > maxSize) {
                return 'File size must be less than 10MB'
              }
              return true
            }
          }
        })}
      />
      <div className="text-sm text-gray-500 mt-1">
        Accepted formats: PDF only. Maximum size: 10MB.
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}