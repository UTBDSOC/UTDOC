import React from 'react'
import { Event } from '@/types'
import { Calendar, MapPin, Users, AlertTriangle } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import ProgressRing from '@/components/shared/ProgressRing'
import Link from 'next/link'

interface EventCardProps {
  event: Event
  taskProgress: number
  eopStatus: {
    total: number
    completed: number
    status: 'green' | 'yellow' | 'red' | 'gray'
  }
  overdueTaskCount: number
}

export default function EventCard({ event, taskProgress, eopStatus, overdueTaskCount }: EventCardProps) {
  const eopColorMap = {
    green: 'bg-status-green',
    yellow: 'bg-status-yellow',
    red: 'bg-status-red',
    gray: 'bg-status-gray'
  }

  return (
    <Link 
      href={`/events/${event.id}`}
      className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-accent-gold/30 hover:bg-bg-elevated/50 transition-all cursor-pointer shadow-lg shadow-black/20 relative overflow-hidden flex flex-col h-full"
    >
      {/* Decorative Gradient Line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        event.status === 'active' ? 'bg-status-green' : 
        event.status === 'planning' ? 'bg-accent-gold' : 'bg-status-gray'
      )} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-accent-gold transition-colors line-clamp-2">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>
        
        {overdueTaskCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-status-red/10 text-status-red shrink-0" title={`${overdueTaskCount} Overdue Tasks`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold font-mono">{overdueTaskCount}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6 flex-1">
        {event.venue && (
          <div className="flex items-center gap-2 text-text-secondary text-xs">
            <MapPin className="w-3 h-3 text-white/30" />
            <span className="truncate">{event.venue}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-text-secondary text-xs">
          <Users className="w-3 h-3 text-white/30" />
          <span>{event.estimated_attendance || 0} Expected</span>
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 mt-auto">
        {/* Task Progress */}
        <div className="flex items-center gap-3">
          <ProgressRing percentage={taskProgress} size={36} strokeWidth={4} />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Tasks</span>
            <span className="text-xs text-text-primary font-semibold">{taskProgress}% Done</span>
          </div>
        </div>

        {/* EOP Status */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">EOP Setup</span>
            <span className="text-[10px] font-mono font-bold text-text-primary">{eopStatus.completed}/{eopStatus.total}</span>
          </div>
          <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-white/5 gap-0.5">
            {Array.from({ length: eopStatus.total }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex-1 h-full",
                  i < eopStatus.completed ? eopColorMap[eopStatus.status] : 'bg-transparent'
                )} 
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
