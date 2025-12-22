import React, { useState } from 'react'
import { Upload, X, Check } from 'lucide-react'

interface FileUploadProps {
  label: string
  onChange: (file: File | null) => void
  accept?: string
  required?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, accept = "image/*", required = false }) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
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
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
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
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="py-4">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {file ? (
                  <span className="flex items-center justify-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    {file.name}
                  </span>
                ) : (
                  "ፋይል ይምረጡ"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload