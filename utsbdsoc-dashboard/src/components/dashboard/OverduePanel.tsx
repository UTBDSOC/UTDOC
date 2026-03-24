'use client'

import React from 'react'
import { Task } from '@/types'
import { AlertTriangle, User, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/shared/StatusBadge'
import Link from 'next/link'

interface OverduePanelProps {
  tasks: Task[]
  events: Record<string, string> // Map of event_id to event name
  onUpdateStatus?: (taskId: string, status: Task['status']) => void
}

export default function OverduePanel({ tasks, events, onUpdateStatus }: OverduePanelProps) {
  const overdueTasks = tasks.filter(t => 
    t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed'
  ).sort((a, b) => {
    if (!a.deadline || !b.deadline) return 0
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  if (overdueTasks.length === 0) return null

  return (
    <div className="bg-bg-card border border-status-red/20 rounded-2xl overflow-hidden shadow-xl relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-status-red" />
      
      <div className="bg-status-red/5 px-6 py-4 border-b border-status-red/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-status-red/20 rounded-xl text-status-red">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              Action Required <span className="bg-status-red px-2 py-0.5 rounded text-[10px] text-white">{overdueTasks.length}</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">Tasks past their scheduled deadline across all events.</p>
          </div>
        </div>
        <Link 
          href="/dashboard" // This would ideally go to a filtered view or /my-tasks
          className="text-xs font-bold text-text-secondary hover:text-text-primary uppercase tracking-widest"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto custom-scrollbar max-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-elevated/30 border-b border-white/5 text-[10px] font-bold text-text-secondary uppercase tracking-widest sticky top-0 backdrop-blur-md">
              <th className="py-3 pl-6 pr-3">Task & Event</th>
              <th className="py-3 px-3">Assignee</th>
              <th className="py-3 px-3">Deadline</th>
              <th className="py-3 pl-3 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {overdueTasks.map(task => {
              const daysOverdue = task.deadline 
                ? Math.floor((new Date().getTime() - new Date(task.deadline).getTime()) / (1000 * 60 * 60 * 24))
                : 0

              return (
                <tr key={task.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-text-primary">{task.title}</span>
                      <Link 
                        href={`/events/${task.event_id}`}
                        className="text-[10px] uppercase tracking-widest font-bold text-text-secondary hover:text-accent-gold transition-colors w-fit"
                      >
                        {events[task.event_id] || 'Unknown Event'}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={task.assignee.avatar_url} alt={task.assignee.full_name} />
                        </div>
                        <span className="text-xs text-text-primary truncate max-w-[100px]">{task.assignee.full_name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <User className="w-4 h-4" />
                        <span className="text-xs italic">Unassigned</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-xs text-text-primary">
                        <Calendar className="w-3.5 h-3.5 text-status-red" />
                        {task.deadline ? formatDate(task.deadline) : 'Unknown'}
                      </span>
                      <span className="text-[10px] font-bold text-status-red ml-5">
                        {daysOverdue} days late
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    <StatusBadge 
                      status={task.status} 
                      interactive={!!onUpdateStatus}
                      onChange={onUpdateStatus ? (s) => onUpdateStatus(task.id, s) : undefined} 
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
