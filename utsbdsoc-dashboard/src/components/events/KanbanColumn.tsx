'use client'

import React from 'react'
import { Task, Member, TaskStatus } from '@/types'
import { Calendar, User } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  label: string
  tasks: Task[]
  members: Member[]
  onUpdate: (taskId: string, updates: Partial<Task>) => void
}

const statusColors: Record<TaskStatus, string> = {
  not_started: 'bg-status-gray text-bg-primary',
  in_progress: 'bg-status-yellow text-bg-primary',
  blocked: 'bg-status-red text-white',
  completed: 'bg-status-green text-bg-primary'
}

export default function KanbanColumn({ status, label, tasks, onUpdate }: KanbanColumnProps) {
  // Simple drop handling without external library for Sprint 2
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      onUpdate(taskId, { status })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div 
      className="flex flex-col h-full bg-bg-elevated/30 border border-white/5 rounded-2xl overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-card">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', statusColors[status].split(' ')[0])} />
          {label}
        </h4>
        <span className="w-5 h-5 rounded-full bg-bg-elevated text-text-secondary text-[10px] flex items-center justify-center font-bold">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar min-h-[150px]">
        {tasks.map(task => (
          <div 
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
            className="bg-bg-card border border-white/5 p-4 rounded-xl shadow-lg cursor-grab hover:border-accent-gold/30 hover:shadow-accent-gold/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-bg-elevated px-2 py-0.5 rounded">
                {task.category}
              </span>
            </div>
            <h5 className="text-sm font-semibold text-text-primary mb-3 leading-snug group-hover:text-accent-gold transition-colors">
              {task.title}
            </h5>
            
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
              {task.assignee ? (
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10" title={task.assignee.full_name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={task.assignee.avatar_url} alt={task.assignee.full_name} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center border border-dashed border-white/20 text-text-secondary" title="Unassigned">
                  <User className="w-3 h-3" />
                </div>
              )}
              
              <div className={cn(
                "flex items-center gap-1.5 text-[10px] font-medium",
                task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed' 
                  ? "text-status-red" 
                  : "text-text-secondary"
              )}>
                <Calendar className="w-3 h-3" />
                <span>{task.deadline ? formatDate(task.deadline) : 'No date'}</span>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-text-secondary/50 text-[10px] uppercase tracking-widest font-bold italic py-8 border border-dashed border-white/5 rounded-xl">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}
