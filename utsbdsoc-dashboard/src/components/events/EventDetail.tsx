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
  ChevronLeft,
  UserPlus,
  UserMinus,
  AlertTriangle
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/shared/StatusBadge'
import TaskBoard from './TaskBoard'
import EOPChecklist from './EOPChecklist'
import FileGallery from './FileGallery'
import MeetingMinutesList from './MeetingMinutesList'
import MeetingMinutesForm from './MeetingMinutesForm'
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

export default function EventDetail({ event: initialEvent, tasks, members, eopItems, files, minutes: initialMinutes }: EventDetailProps) {
  const [event, setEvent] = useState(initialEvent)
  const [activeTab, setActiveTab] = useState('tasks')
  const [minutes, setMinutes] = useState(initialMinutes)
  const [isAddingMinutes, setIsCreatingMinutes] = useState(false)
  const [selectedMinutes, setSelectedMinutes] = useState<MeetingMinutes | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: event.name,
    venue: event.venue || '',
    estimated_attendance: event.estimated_attendance || 0,
    description: event.description || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [eventMembers, setEventMembers] = useState<string[]>([])
  const [isStatusSaving, setIsStatusSaving] = useState(false)

  // Fetch event members on mount
  React.useEffect(() => {
    fetch(`/api/events/${initialEvent.id}/members`)
      .then(res => res.json())
      .then(json => { if (json.success) setEventMembers(json.data.map((m: { member_id: string }) => m.member_id)) })
      .catch(() => {})
  }, [initialEvent.id])

  const renderTabContent = () => {
    switch(activeTab) {
      case 'tasks':
        return <TaskBoard tasks={tasks} members={members} eventId={event.id} />
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
              onSave={async (data) => {
                try {
                  const res = await fetch(`/api/events/${event.id}/minutes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  })
                  if (res.ok) {
                    const json = await res.json()
                    setMinutes(prev => [json.data, ...prev])
                  }
                } catch (err) {
                  console.error('Failed to save minutes:', err)
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
          <div className="space-y-8">
            {/* Event Status */}
            <div className="bg-bg-card border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Event Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['planning', 'active', 'post_event', 'archived'] as const).map(status => (
                  <button
                    key={status}
                    disabled={isStatusSaving}
                    onClick={async () => {
                      if (event.status === status) return
                      setIsStatusSaving(true)
                      try {
                        const res = await fetch(`/api/events/${event.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status }),
                        })
                        if (res.ok) {
                          const json = await res.json()
                          setEvent(json.data)
                        }
                      } catch (err) {
                        console.error('Failed to update status:', err)
                      } finally {
                        setIsStatusSaving(false)
                      }
                    }}
                    className={cn(
                      'px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border',
                      event.status === status
                        ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold'
                        : 'border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5'
                    )}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Access */}
            <div className="bg-bg-card border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Team Members</h3>
                <span className="text-xs text-text-secondary">{eventMembers.length} assigned</span>
              </div>
              <div className="space-y-2">
                {members.map(m => {
                  const isAssigned = eventMembers.includes(m.id)
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`} alt={m.full_name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{m.full_name}</p>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest">{m.role} &middot; {m.team}</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const newMembers = isAssigned
                            ? eventMembers.filter(id => id !== m.id)
                            : [...eventMembers, m.id]
                          setEventMembers(newMembers)
                          try {
                            await fetch(`/api/events/${event.id}/members`, {
                              method: isAssigned ? 'DELETE' : 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ member_id: m.id }),
                            })
                          } catch {
                            // Revert on failure
                            setEventMembers(eventMembers)
                          }
                        }}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all',
                          isAssigned
                            ? 'text-status-red hover:bg-status-red/10'
                            : 'text-accent-gold hover:bg-accent-gold/10'
                        )}
                      >
                        {isAssigned ? <><UserMinus className="w-3 h-3" /> Remove</> : <><UserPlus className="w-3 h-3" /> Add</>}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-bg-card border border-status-red/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-red" />
                <h3 className="text-sm font-bold text-status-red uppercase tracking-widest">Danger Zone</h3>
              </div>
              <p className="text-xs text-text-secondary">Archiving an event hides it from the main list. This can be undone by changing the status back.</p>
              <button
                onClick={async () => {
                  if (event.status === 'archived') return
                  setIsStatusSaving(true)
                  try {
                    const res = await fetch(`/api/events/${event.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'archived' }),
                    })
                    if (res.ok) {
                      const json = await res.json()
                      setEvent(json.data)
                    }
                  } catch (err) {
                    console.error('Failed to archive:', err)
                  } finally {
                    setIsStatusSaving(false)
                  }
                }}
                disabled={event.status === 'archived' || isStatusSaving}
                className="px-5 py-2 rounded-xl border border-status-red/30 text-xs font-bold text-status-red hover:bg-status-red/10 transition-all disabled:opacity-50"
              >
                {event.status === 'archived' ? 'Already Archived' : 'Archive Event'}
              </button>
            </div>
          </div>
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
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
            >
              {isEditing ? 'Cancel' : 'Edit Details'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-accent-gold text-bg-primary text-xs font-bold hover:bg-accent-gold/90 transition-all shadow-lg shadow-accent-gold/10"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Inline Edit Form */}
      {isEditing && (
        <div className="bg-bg-card border border-accent-gold/20 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-accent-gold uppercase tracking-widest">Edit Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Name</label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Venue</label>
              <input
                value={editForm.venue}
                onChange={(e) => setEditForm(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Expected Attendance</label>
              <input
                type="number"
                value={editForm.estimated_attendance}
                onChange={(e) => setEditForm(prev => ({ ...prev, estimated_attendance: Number(e.target.value) }))}
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Description</label>
              <input
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 rounded-xl border border-white/10 text-xs font-bold text-text-secondary hover:text-text-primary transition-all"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              onClick={async () => {
                setIsSaving(true)
                try {
                  const res = await fetch(`/api/events/${event.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editForm),
                  })
                  if (res.ok) {
                    const json = await res.json()
                    setEvent(json.data)
                    setIsEditing(false)
                  }
                } catch (err) {
                  console.error('Failed to update event:', err)
                } finally {
                  setIsSaving(false)
                }
              }}
              className="px-5 py-2 rounded-xl bg-accent-gold text-bg-primary text-xs font-bold hover:bg-accent-gold/90 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

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
