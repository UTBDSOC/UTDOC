'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { CheckSquare, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'
import { cn, formatDate } from '@/lib/utils'
import type { Task, Event } from '@/types'

type FilterTab = 'all' | 'due_this_week' | 'overdue' | 'completed'

export default function MyTasksPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksRes, eventsRes] = await Promise.all([
          fetch('/api/tasks?assignee_id=me'),
          fetch('/api/events'),
        ])

        if (tasksRes.ok) {
          const tasksJson = await tasksRes.json()
          setMyTasks(tasksJson.data ?? [])
        }

        if (eventsRes.ok) {
          const eventsJson = await eventsRes.json()
          setEvents(eventsJson.data ?? [])
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredTasks = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    return myTasks.filter(task => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'completed') return task.status === 'completed'

      const deadlineDate = task.deadline ? new Date(task.deadline) : null

      if (activeFilter === 'overdue') {
        return deadlineDate && deadlineDate < today && task.status !== 'completed'
      }

      if (activeFilter === 'due_this_week') {
        return deadlineDate && deadlineDate >= today && deadlineDate <= nextWeek && task.status !== 'completed'
      }

      return true
    })
  }, [myTasks, activeFilter])

  // Group by event
  const groupedTasks = useMemo(() => {
    const groups: Record<string, typeof myTasks> = {}

    filteredTasks.forEach(task => {
      const event = events.find(e => e.id === task.event_id)
      const eventName = event?.name || 'Unknown Event'

      if (!groups[eventName]) groups[eventName] = []
      groups[eventName].push(task)
    })

    return groups
  }, [filteredTasks, events])

  const tabs = [
    { id: 'all', label: 'All Tasks', icon: CheckSquare },
    { id: 'due_this_week', label: 'Due This Week', icon: Clock },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-text-secondary text-sm">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-sans leading-tight">My Tasks</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your personal action items across all society events.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-card border border-white/5 rounded-xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterTab)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all',
                isActive
                  ? 'bg-accent-gold text-bg-primary shadow-lg shadow-accent-gold/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              <tab.icon className={cn('w-4 h-4', isActive ? 'opacity-80' : '')} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="You're all caught up!"
          description="No tasks found matching this filter. Enjoy your free time."
          className="min-h-[400px]"
        />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {Object.entries(groupedTasks).map(([eventName, tasks]) => (
            <div key={eventName} className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-bg-elevated/50 px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent-gold/50 shadow-[0_0_10px_#E8C547]" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">{eventName}</h3>
                <span className="ml-auto text-xs font-bold text-text-secondary bg-white/5 px-3 py-1 rounded-full">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {tasks.map(task => {
                  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed'
                  return (
                    <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                            {task.title}
                          </h4>
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-red/10 text-status-red uppercase tracking-widest flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                          <span className="uppercase tracking-widest font-bold opacity-70">
                            {task.category}
                          </span>
                          {task.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
