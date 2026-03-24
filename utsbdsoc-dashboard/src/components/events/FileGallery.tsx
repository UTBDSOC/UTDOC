'use client'

import React, { useState } from 'react'
import { EventFile } from '@/types'
import { File as FileIcon, Download, Trash2, Image as ImageIcon, FileText, FileSpreadsheet } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import FileUpload from '@/components/shared/FileUpload'
import SearchInput from '@/components/shared/SearchInput'

interface FileGalleryProps {
  files: EventFile[]
  eventId: string
}

const CATEGORIES = ['All', 'Finance', 'Marketing', 'Logistics', 'Proposals', 'Other']

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
    case 'docx':
    case 'doc':
      return <FileText className="w-8 h-8 text-status-blue" />
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className="w-8 h-8 text-status-green" />
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <ImageIcon className="w-8 h-8 text-status-purple" />
    default:
      return <FileIcon className="w-8 h-8 text-text-secondary" />
  }
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function FileGallery({ files: initialFiles, eventId }: FileGalleryProps) {
  const [files, setFiles] = useState(initialFiles)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const filteredFiles = files.filter(file => {
    const matchesCategory = activeCategory === 'All' || file.category === activeCategory
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUpload = async (file: File) => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newFile: EventFile = {
      id: `f-${Date.now()}`,
      event_id: eventId,
      file_name: file.name,
      file_url: URL.createObjectURL(file),
      category: activeCategory === 'All' ? 'Other' : activeCategory,
      uploaded_by_id: 'm1',
      uploaded_at: new Date().toISOString(),
      file_size_bytes: file.size,
      uploaded_by: {
        id: 'm1',
        email: 'president@utsbdsoc.com',
        full_name: 'Wasif Karim',
        role: 'admin',
        team: 'general',
        created_at: new Date().toISOString(),
      }
    }
    
    setFiles(prev => [newFile, ...prev])
    setIsUploading(false)
    return newFile.file_url
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput 
          placeholder="Search files..." 
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                activeCategory === category 
                  ? 'bg-accent-gold text-bg-primary shadow-lg shadow-accent-gold/10' 
                  : 'bg-bg-card border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone (Expandable) */}
      <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Document Center</h3>
          <button 
            onClick={() => setIsUploading(!isUploading)}
            className="text-xs font-bold text-accent-gold hover:text-accent-gold/80 transition-colors"
          >
            {isUploading ? 'Cancel Upload' : '+ Upload New File'}
          </button>
        </div>
        
        {isUploading && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <FileUpload onUpload={handleUpload} maxSizeMB={20} />
          </div>
        )}

        {/* File Grid */}
        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <div key={file.id} className="group bg-bg-elevated/30 border border-white/5 rounded-xl p-4 hover:border-accent-gold/30 hover:bg-bg-elevated transition-all flex flex-col h-40">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 rounded-lg bg-bg-card shadow-inner">
                    {getFileIcon(file.file_name)}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={file.file_url} 
                      download={file.file_name}
                      className="p-1.5 rounded bg-bg-card text-text-secondary hover:text-accent-gold transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => handleDelete(file.id)}
                      className="p-1.5 rounded bg-bg-card text-text-secondary hover:text-status-red transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-sm font-semibold text-text-primary truncate mb-1" title={file.file_name}>
                  {file.file_name}
                </h4>
                
                <div className="mt-auto space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-text-secondary">
                    <span className="uppercase tracking-widest font-bold">{file.category}</span>
                    <span>{file.file_size_bytes ? formatBytes(file.file_size_bytes) : 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-text-secondary border-t border-white/5 pt-2">
                    <span>{file.uploaded_by?.full_name || 'Unknown User'}</span>
                    <span>{formatDate(file.uploaded_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
            <FileIcon className="w-8 h-8 text-text-secondary opacity-30 mb-3" />
            <p className="text-sm font-semibold text-text-primary">No files found</p>
            <p className="text-xs text-text-secondary mt-1">Upload a document or change your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
