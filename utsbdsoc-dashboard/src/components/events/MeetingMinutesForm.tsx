'use client'

import React, { useState } from 'react'
import { ActionItem, Member } from '@/types'
import { Plus, X, Trash2, CheckCircle2, User, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import DatePicker from '@/components/shared/DatePicker'

interface MeetingMinutesFormProps {
  members: Member[]
  onSave: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export default function MeetingMinutesForm({ members, onSave, onCancel, initialData }: MeetingMinutesFormProps) {
  const [meetingDate, setMeetingDate] = useState(initialData?.meeting_date || new Date().toISOString().split('T')[0])
  const [agenda, setAgenda] = useState(initialData?.agenda || '')
  const [discussion, setDiscussion] = useState(initialData?.discussion || '')
  const [attendees, setAttendees] = useState<string[]>(initialData?.attendees || [])
  const [actionItems, setActionItems] = useState<ActionItem[]>(initialData?.action_items || [])

  const handleAddActionItem = () => {
    setActionItems([...actionItems, { description: '', assignee_id: '', deadline: '', create_task: true }])
  }

  const handleRemoveActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index))
  }

  const handleUpdateActionItem = (index: number, updates: Partial<ActionItem>) => {
    setActionItems(actionItems.map((item, i) => i === index ? { ...item, ...updates } : item))
  }

  const toggleAttendee = (name: string) => {
    setAttendees(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      meeting_date: meetingDate,
      agenda,
      discussion,
      attendees,
      action_items: actionItems
    })
  }

  return (
    <div className="bg-bg-card border border-white/5 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Meeting Log</h2>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Meeting Date</label>
              <DatePicker value={meetingDate} onChange={setMeetingDate} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Primary Agenda</label>
              <input 
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="e.g. Budget finalization for Boishakhi Mela"
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Attendees</label>
              <div className="flex flex-wrap gap-2">
                {members.map(member => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAttendee(member.full_name)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                      attendees.includes(member.full_name)
                        ? "bg-accent-gold text-bg-primary border-accent-gold shadow-lg shadow-accent-gold/10"
                        : "bg-white/5 text-text-secondary border-white/5 hover:border-white/20"
                    )}
                  >
                    {member.full_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Discussion Notes</label>
            <textarea 
              value={discussion}
              onChange={(e) => setDiscussion(e.target.value)}
              rows={8}
              placeholder="Summary of what was discussed, key decisions made..."
              className="w-full bg-bg-elevated/50 border border-white/10 rounded-2xl py-4 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner resize-none"
            />
          </div>
        </div>

        {/* Action Items Section */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent-gold" />
              Action Items
            </h3>
            <button 
              type="button"
              onClick={handleAddActionItem}
              className="text-xs font-bold text-accent-gold hover:text-accent-gold/80 transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {actionItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative group animate-in slide-in-from-top-2 duration-200">
                <div className="flex-1 space-y-2">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest ml-1">Task Description</label>
                  <input 
                    value={item.description}
                    onChange={(e) => handleUpdateActionItem(index, { description: e.target.value })}
                    placeholder="What needs to be done?"
                    className="w-full bg-bg-card border border-white/10 rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
                  />
                </div>
                
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest ml-1">Assignee</label>
                  <select 
                    value={item.assignee_id}
                    onChange={(e) => handleUpdateActionItem(index, { assignee_id: e.target.value })}
                    className="w-full bg-bg-card border border-white/10 rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none appearance-none"
                  >
                    <option value="">Select...</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-40 space-y-2">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest ml-1">Deadline</label>
                  <input 
                    type="date"
                    value={item.deadline}
                    onChange={(e) => handleUpdateActionItem(index, { deadline: e.target.value })}
                    className="w-full bg-bg-card border border-white/10 rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => handleRemoveActionItem(index)}
                  className="md:mt-6 p-2 text-text-secondary hover:text-status-red hover:bg-status-red/10 rounded-lg transition-all self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {actionItems.length === 0 && (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl text-text-secondary text-xs italic">
                No action items defined yet.
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 rounded-xl border border-white/10 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-10 py-3 rounded-xl bg-accent-gold text-bg-primary text-sm font-bold hover:bg-accent-gold/90 transition-all shadow-xl shadow-accent-gold/10"
          >
            Save Meeting Log
          </button>
        </div>
      </form>
    </div>
  )
}
