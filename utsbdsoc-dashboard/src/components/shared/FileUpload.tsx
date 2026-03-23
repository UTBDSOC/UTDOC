'use client'

import React, { useState, useRef } from 'react'
import { Upload, File, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

interface FileUploadProps {
  onUpload: (file: File) => Promise<string>
  accept?: string[]
  maxSizeMB?: number
  label?: string
  className?: string
}

export default function FileUpload({
  onUpload,
  accept = ['.pdf', '.docx', '.xlsx', '.png', '.jpg'],
  maxSizeMB = 5,
  label,
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }

    setIsUploading(true)
    try {
      await onUpload(file)
      setUploadedFile({ name: file.name, size: file.size })
    } catch (err) {
      setError('Failed to upload file. Please try again.')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</label>}
      
      {!uploadedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer group',
            isDragging ? 'border-accent-gold bg-accent-gold/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
            accept={accept.join(',')}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <LoadingSpinner size="sm" className="mb-2" />
              <span className="text-sm font-medium text-text-secondary">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-white/5 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-text-secondary group-hover:text-accent-gold transition-colors" />
              </div>
              <p className="text-sm font-medium text-text-primary mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-text-secondary">
                {accept.join(', ')} (Max {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-bg-elevated border border-status-green/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-green/10 text-status-green">
              <File className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary truncate max-w-[200px]">
                {uploadedFile.name}
              </span>
              <span className="text-[10px] text-text-secondary">
                {(uploadedFile.size / 1024).toFixed(1)} KB • Uploaded
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-status-green" />
            <button
              onClick={() => setUploadedFile(null)}
              className="p-1 hover:bg-white/5 rounded-md text-text-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {error && <p className="text-[10px] text-status-red font-medium px-1">{error}</p>}
    </div>
  )
}
