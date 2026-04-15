import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X, Check } from 'lucide-react'

interface FileUploadProps {
  label: string
  onChange: (file: File | null) => void
  accept?: string
  required?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, accept = "image/*", required = false }) => {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setError(t('file_size_error', { size: '2MB' }))
      setFile(null)
      setPreview(null)
      onChange(null)
      // Reset input value to allow selecting the same file after failure if needed
      e.target.value = ''
      return
    }

    setError(null)
    setFile(selectedFile)
    onChange(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={`border-2 border-dashed rounded-lg p-4 bg-secondary text-center hover:border-primary-light transition-colors ${error ? 'border-red-500' : 'border-accent/40'}`}>
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-32 mx-auto rounded"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 hover:bg-primary-dark transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="py-4">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {file ? (
                  <span className="flex items-center justify-center gap-1 text-primary">
                    <Check className="w-4 h-4" />
                    {file.name}
                  </span>
                ) : (
                  t('choose_file')
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default FileUpload