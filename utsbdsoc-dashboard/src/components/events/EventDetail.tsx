'use client'

import React, { useState } from 'react'
import { Event, Task, Member, EOPItem as EOPItemType, EventFile, MeetingMinutes } from '@/types'
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckSquare, 
  FileText, 
  Paperclip, 
  MessageSquare, 
  Settings,
  ChevronLeft
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/shared/StatusBadge'
import TaskBoard from './TaskBoard'
import EOPChecklist from './EOPChecklist'
import FileGallery from './FileGallery'
import MeetingMinutesList from './MeetingMinutesList'
import MeetingMinutesForm from './MeetingMinutesForm'
import EmptyState from '@/components/shared/EmptyState'
import Link from 'next/link'

interface EventDetailProps {
  event: Event
  tasks: Task[]
  members: Member[]
  eopItems: EOPItemType[]
  files: EventFile[]
  minutes: MeetingMinutes[]
}

const tabs = [
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'eop', label: 'EOP', icon: FileText },
  { id: 'files', label: 'Files', icon: Paperclip },
  { id: 'minutes', label: 'Minutes', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function EventDetail({ event, tasks, members, eopItems, files, minutes: initialMinutes }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState('tasks')
  const [minutes, setMinutes] = useState(initialMinutes)
  const [isAddingMinutes, setIsCreatingMinutes] = useState(false)
  const [selectedMinutes, setSelectedMinutes] = useState<MeetingMinutes | null>(null)

  const renderTabContent = () => {
    switch(activeTab) {
      case 'tasks':
        return <TaskBoard tasks={tasks} members={members} />
      case 'eop':
        return <EOPChecklist event={event} initialItems={eopItems} />
      case 'files':
        return <FileGallery files={files} eventId={event.id} />
      case 'minutes':
        if (isAddingMinutes || selectedMinutes) {
          return (
            <MeetingMinutesForm 
              members={members} 
              initialData={selectedMinutes}
              onSave={(data) => {
                if (selectedMinutes) {
                  setMinutes(prev => prev.map(m => m.id === selectedMinutes.id ? { ...m, ...data } : m))
                } else {
                  setMinutes(prev => [{ ...data, id: `min-${Date.now()}`, event_id: event.id, created_at: new Date().toISOString() }, ...prev])
                }
                setIsCreatingMinutes(false)
                setSelectedMinutes(null)
              }}
              onCancel={() => {
                setIsCreatingMinutes(false)
                setSelectedMinutes(null)
              }}
            />
          )
        }
        return (
          <MeetingMinutesList 
            minutes={minutes} 
            onAddMinutes={() => setIsCreatingMinutes(true)}
            onSelectMinutes={setSelectedMinutes}
          />
        )
      case 'settings':
        return (
          <EmptyState 
            icon={Settings}
            title="Event Settings"
            description="Configure event details, team access, and notification rules. Coming in Sprint 5."
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Back Button */}
      <Link 
        href="/events" 
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-xs font-bold uppercase tracking-widest group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </Link>

      {/* Header Card */}
      <div className="bg-bg-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={event.status === 'post_event' ? 'completed' : event.status === 'planning' ? 'in_progress' : 'not_started'} />
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Event ID: {event.id}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-text-primary font-sans leading-tight">
              {event.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent-gold" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-gold" />
                <span>{event.venue || 'Venue TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-gold" />
                <span>{event.estimated_attendance || 0} Expected</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => alert('Editing event details is coming soon.')} className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
              Edit Details
            </button>
            <button onClick={() => alert('Generating PDF report...')} className="px-6 py-2.5 rounded-xl bg-accent-gold text-bg-primary text-xs font-bold hover:bg-accent-gold/90 transition-all shadow-lg shadow-accent-gold/10">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative',
                isActive ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold shadow-[0_0_10px_#E8C547]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderTabContent()}
      </div>
    </div>
  )
}
