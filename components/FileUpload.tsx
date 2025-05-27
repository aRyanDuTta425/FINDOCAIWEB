'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import dynamic from 'next/dynamic'
import { formatFileSize } from '@/lib/utils'

// Dynamic imports for lucide-react icons
const Upload = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Upload })), { ssr: false })
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false })
const FileText = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), { ssr: false })
const Image = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Image })), { ssr: false })
const AlertCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertCircle })), { ssr: false })

interface FileUploadProps {
  onSuccess: (document: any) => void
  onClose: () => void
}

export default function FileUpload({ onSuccess, onClose }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess(data.document)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [onSuccess])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-secondary-900">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
            disabled={uploading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-secondary-300 hover:border-primary-400'
          } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-secondary-600">Uploading document...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-secondary-400 mx-auto" />
              
              {isDragActive ? (
                <p className="text-lg text-primary-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-lg text-secondary-900 mb-2">
                    Drag & drop your document here
                  </p>
                  <p className="text-secondary-600">or click to browse files</p>
                </div>
              )}

              <div className="flex justify-center space-x-4 text-sm text-secondary-500">
                <div className="flex items-center">
                  <Image className="h-4 w-4 mr-1" />
                  Images
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  PDFs
                </div>
              </div>

              <p className="text-xs text-secondary-500">
                Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* File Rejection Errors */}
        {fileRejections.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-600">
                <p className="font-medium mb-1">File rejected:</p>
                {fileRejections.map(({ file, errors }) => (
                  <div key={file.name}>
                    <p className="font-medium">{file.name}</p>
                    <ul className="list-disc list-inside ml-2">
                      {errors.map((error) => (
                        <li key={error.code}>
                          {error.code === 'file-too-large'
                            ? `File is too large. Maximum size is 10MB, but file is ${formatFileSize(file.size)}`
                            : error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
