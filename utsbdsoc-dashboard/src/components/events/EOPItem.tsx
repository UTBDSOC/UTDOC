'use client'

import React, { useState } from 'react'
import { EOPItem as EOPItemType } from '@/types'
import { CheckCircle2, Circle, UploadCloud, File as FileIcon, X, ExternalLink } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import FileUpload from '@/components/shared/FileUpload'

interface EOPItemProps {
  item: EOPItemType
  onToggleComplete: (id: string, isCompleted: boolean) => void
  onUploadFile: (id: string, file: File) => Promise<string>
}

export default function EOPItem({ item, onToggleComplete, onUploadFile }: EOPItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      await onUploadFile(item.id, file)
      setShowUploader(false)
    } finally {
      setIsUploading(false)
    }
    return 'uploaded_url'
  }

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all",
      item.is_completed 
        ? "bg-status-green/5 border-status-green/20" 
        : "bg-bg-card border-white/5 hover:border-white/10"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 flex-1">
          <button 
            onClick={() => onToggleComplete(item.id, !item.is_completed)}
            className="mt-0.5 sm:mt-0"
          >
            {item.is_completed ? (
              <CheckCircle2 className="w-6 h-6 text-status-green" />
            ) : (
              <Circle className="w-6 h-6 text-text-secondary hover:text-text-primary transition-colors" />
            )}
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className={cn(
              "text-sm font-semibold",
              item.is_completed ? "text-text-primary" : "text-text-primary"
            )}>
              {item.label}
            </span>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit",
              item.is_required 
                ? "bg-status-red/10 text-status-red" 
                : "bg-status-blue/10 text-status-blue"
            )}>
              {item.is_required ? 'Mandatory' : 'Conditional'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {item.file_url ? (
            <a 
              href={item.file_url} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated hover:bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-text-primary transition-colors"
            >
              <FileIcon className="w-3.5 h-3.5 text-accent-gold" />
              <span className="hidden sm:inline">View Document</span>
              <ExternalLink className="w-3 h-3 text-text-secondary" />
            </a>
          ) : (
            <button 
              onClick={() => setShowUploader(!showUploader)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                showUploader 
                  ? "bg-white/10 text-text-primary" 
                  : "bg-bg-elevated border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20"
              )}
            >
              {showUploader ? <X className="w-3.5 h-3.5" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showUploader ? 'Cancel' : 'Upload'}</span>
            </button>
          )}
        </div>
      </div>

      {showUploader && !item.file_url && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <FileUpload 
            onUpload={handleUpload} 
            maxSizeMB={10} 
            accept={['.pdf', '.docx', '.png', '.jpg']} 
          />
        </div>
      )}
      
      {item.uploaded_at && item.file_url && (
        <div className="mt-3 pl-9 text-[10px] text-text-secondary">
          Uploaded on {formatDate(item.uploaded_at)}
        </div>
      )}
    </div>
  )
}
