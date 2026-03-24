'use client'

import React from 'react'
import { MeetingMinutes } from '@/types'
import { Calendar, Users, MessageSquare, ChevronRight, FileText, Plus } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface MeetingMinutesListProps {
  minutes: MeetingMinutes[]
  onAddMinutes: () => void
  onSelectMinutes: (minutes: MeetingMinutes) => void
}

export default function MeetingMinutesList({ minutes, onAddMinutes, onSelectMinutes }: MeetingMinutesListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-widest border-l-2 border-accent-gold pl-3">Meeting Records</h2>
          <p className="text-xs text-text-secondary mt-1 ml-3">Formal logs of society discussions and action items.</p>
        </div>
        <button 
          onClick={onAddMinutes}
          className="flex items-center gap-2 bg-bg-elevated border border-accent-gold/20 px-4 py-2 rounded-xl text-xs font-bold text-text-primary hover:bg-bg-elevated/80 transition-all"
        >
          <Plus className="w-4 h-4" />
          Record Minutes
        </button>
      </div>

      {minutes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {minutes.map(item => (
            <div 
              key={item.id}
              onClick={() => onSelectMinutes(item)}
              className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-accent-gold/30 hover:bg-bg-elevated transition-all cursor-pointer shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 rounded-xl bg-bg-elevated border border-white/5 text-accent-gold shadow-inner">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-bg-elevated px-2 py-1 rounded">
                  {item.action_items.length} Action Items
                </div>
              </div>

              <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-accent-gold transition-colors">
                {item.agenda}
              </h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                  <Calendar className="w-3.5 h-3.5 text-white/30" />
                  <span>{formatDate(item.meeting_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                  <Users className="w-3.5 h-3.5 text-white/30" />
                  <span className="truncate">{item.attendees.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">
                <span className="uppercase tracking-widest">View Full Record</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="p-4 rounded-full bg-white/5 mb-4">
            <FileText className="w-10 h-10 text-text-secondary opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No meeting records yet</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-xs mx-auto">
            Document your team syncs to keep track of decisions and auto-generate tasks.
          </p>
          <button 
            onClick={onAddMinutes}
            className="mt-6 px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            Create Your First Log
          </button>
        </div>
      )}
    </div>
  )
}
