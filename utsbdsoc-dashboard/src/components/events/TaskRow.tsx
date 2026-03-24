'use client'

import React, { useState } from 'react'
import { Task, Member } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/shared/StatusBadge'
import { Calendar, User, MoreVertical } from 'lucide-react'

interface TaskRowProps {
  task: Task
  members: Member[]
  isSelected?: boolean
  onToggleSelect?: (taskId: string) => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
}

export default function TaskRow({ task, /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ members, isSelected, onToggleSelect, onUpdate }: TaskRowProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(task.notes || '')

  return (
    <tr className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      {onToggleSelect && (
        <td className="py-4 pl-4 pr-1">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onToggleSelect(task.id)}
            className="w-4 h-4 rounded border-white/10 bg-bg-primary text-accent-gold focus:ring-accent-gold/30 cursor-pointer"
          />
        </td>
      )}
      <td className={cn("py-4 pr-3", !onToggleSelect && "pl-4")}>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
            {task.title}
          </span>
          <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-0.5">
            {task.category}
          </span>
        </div>
      </td>
      <td className="py-4 px-3">
        <StatusBadge 
          status={task.status} 
          interactive 
          onChange={(status) => onUpdate(task.id, { status })} 
        />
      </td>
      <td className="py-4 px-3">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={task.assignee.avatar_url} alt={task.assignee.full_name} />
              </div>
              <span className="text-xs text-text-primary">{task.assignee.full_name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-text-secondary">
              <User className="w-3 h-3" />
              <span className="text-xs italic">Unassigned</span>
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-3">
        <div className={cn(
          "flex items-center gap-2 text-xs",
          task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed' 
            ? "text-status-red font-bold" 
            : "text-text-secondary"
        )}>
          <Calendar className="w-3 h-3" />
          <span>{task.deadline ? formatDate(task.deadline) : 'No date'}</span>
        </div>
      </td>
      <td className="py-4 px-3">
        {isEditingNotes ? (
          <input 
            autoFocus
            className="w-full bg-bg-elevated border border-accent-gold/30 rounded px-2 py-1 text-xs text-text-primary focus:outline-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              setIsEditingNotes(false)
              onUpdate(task.id, { notes })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingNotes(false)
                onUpdate(task.id, { notes })
              }
            }}
          />
        ) : (
          <div 
            onClick={() => setIsEditingNotes(true)}
            className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary cursor-pointer max-w-[150px] truncate"
          >
            {task.notes || <span className="italic opacity-50">Add notes...</span>}
          </div>
        )}
      </td>
      <td className="py-4 pl-3 pr-4 text-right">
        <button onClick={() => alert('Task options coming soon.')} className="p-1 rounded hover:bg-white/5 text-text-secondary transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}
