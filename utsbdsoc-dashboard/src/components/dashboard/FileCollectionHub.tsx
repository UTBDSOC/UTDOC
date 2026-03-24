'use client'

import React, { useState } from 'react'
import { EventFile } from '@/types'
import { Folder, ChevronDown, ChevronRight, FileText, Image as ImageIcon, FileSpreadsheet, File as FileIcon, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface FileCollectionHubProps {
  files: EventFile[]
  events: Record<string, string> // Map of event_id to event name
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
    case 'docx':
    case 'doc':
      return <FileText className="w-5 h-5 text-status-blue" />
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className="w-5 h-5 text-status-green" />
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <ImageIcon className="w-5 h-5 text-status-purple" />
    default:
      return <FileIcon className="w-5 h-5 text-text-secondary" />
  }
}

export default function FileCollectionHub({ files, events }: FileCollectionHubProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(Object.keys(events).slice(0, 2)))

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev)
      if (next.has(eventId)) next.delete(eventId)
      else next.add(eventId)
      return next
    })
  }

  // Group files by event
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.event_id]) acc[file.event_id] = []
    acc[file.event_id].push(file)
    return acc
  }, {} as Record<string, EventFile[]>)

  if (files.length === 0) return null

  return (
    <div className="bg-bg-card border border-white/5 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-xl text-text-secondary">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-primary">Recent Documents</h3>
          <p className="text-xs text-text-secondary mt-0.5">Files aggregated across active events</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {Object.keys(groupedFiles).map(eventId => {
          const eventFiles = groupedFiles[eventId]
          const isExpanded = expandedEvents.has(eventId)
          const eventName = events[eventId] || 'Unknown Event'

          return (
            <div key={eventId} className="mb-2">
              <button 
                onClick={() => toggleEvent(eventId)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
                  )}
                  <span className="text-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors text-left line-clamp-1">
                    {eventName}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-full shrink-0">
                  {eventFiles.length} files
                </span>
              </button>

              {isExpanded && (
                <div className="pl-9 pr-3 py-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {eventFiles.map(file => (
                    <div 
                      key={file.id} 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-elevated/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0">{getFileIcon(file.file_name)}</div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-text-primary truncate" title={file.file_name}>
                            {file.file_name}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            {formatDate(file.uploaded_at)} • {file.uploaded_by?.full_name?.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={file.file_url}
                        download={file.file_name}
                        className="p-1.5 rounded text-text-secondary opacity-0 group-hover:opacity-100 hover:text-accent-gold hover:bg-white/5 transition-all shrink-0 ml-2"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
