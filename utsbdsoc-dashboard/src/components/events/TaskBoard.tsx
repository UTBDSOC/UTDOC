'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Task, Member, TaskStatus } from '@/types'
import TaskRow from './TaskRow'
import TaskCreator from './TaskCreator'
import KanbanColumn from './KanbanColumn'
import { Plus, List, Layout as LayoutIcon, ChevronDown, ChevronRight, CheckSquare, Trash2 } from 'lucide-react'
import SearchInput from '@/components/shared/SearchInput'
import { cn } from '@/lib/utils'

interface TaskBoardProps {
  tasks: Task[]
  members: Member[]
  eventId: string
}

const CATEGORIES = [
  'General', 'Contracts & Proposals', 'Marketing', 'Event Program', 'Decorations', 'Food & Catering', 'Finance'
]

const CATEGORY_API_MAP: Record<string, string> = {
  'General': 'GENERAL',
  'Contracts & Proposals': 'CONTRACTS_PROPOSALS',
  'Marketing': 'MARKETING',
  'Event Program': 'EVENT_PROGRAM',
  'Decorations': 'DECORATIONS',
  'Food & Catering': 'FOOD_CATERING',
  'Finance': 'FINANCE',
}

export default function TaskBoard({ tasks: initialTasks, members, eventId }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tasks, searchQuery])

  // Grouping for Table View
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {}
    CATEGORIES.forEach(cat => groups[cat] = [])
    
    filteredTasks.forEach(task => {
      if (!groups[task.category]) groups[task.category] = []
      groups[task.category].push(task)
    })
    
    // Remove empty categories if searching
    if (searchQuery) {
      Object.keys(groups).forEach(key => {
        if (groups[key].length === 0) delete groups[key]
      })
    }
    return groups
  }, [filteredTasks, searchQuery])

  // Handlers
  const handleUpdateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))

    try {
      const body: Record<string, unknown> = {}
      if (updates.status !== undefined) body.status = updates.status
      if (updates.assignee_id !== undefined) body.assignee_id = updates.assignee_id
      if (updates.deadline !== undefined) body.deadline = updates.deadline
      if (updates.notes !== undefined) body.notes = updates.notes
      if (updates.title !== undefined) body.text = updates.title

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        // Revert on failure
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
        console.error('Failed to update task')
      } else {
        const json = await res.json()
        setTasks(prev => prev.map(t => t.id === taskId ? json.data : t))
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }, [])

  const handleAddTask = async (newTask: Partial<Task>) => {
    setIsCreating(false)

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          text: newTask.title || 'New Task',
          category: CATEGORY_API_MAP[newTask.category || 'General'] || 'GENERAL',
          assignee_id: newTask.assignee_id || undefined,
          deadline: newTask.deadline || undefined,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        setTasks(prev => [json.data, ...prev])
      } else {
        console.error('Failed to create task')
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const toggleSelectTask = (taskId: string) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedTaskIds.size === filteredTasks.length) {
      setSelectedTaskIds(new Set())
    } else {
      setSelectedTaskIds(new Set(filteredTasks.map(t => t.id)))
    }
  }

  const handleBulkStatusChange = async (status: TaskStatus) => {
    const ids = Array.from(selectedTaskIds)
    // Optimistic
    setTasks(prev => prev.map(t => selectedTaskIds.has(t.id) ? { ...t, status } : t))
    setSelectedTaskIds(new Set())

    try {
      const res = await fetch('/api/tasks/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_ids: ids, updates: { status } }),
      })

      if (res.ok) {
        const json = await res.json()
        const updatedMap = new Map((json.data as Task[]).map(t => [t.id, t]))
        setTasks(prev => prev.map(t => updatedMap.get(t.id) ?? t))
      }
    } catch (err) {
      console.error('Failed to bulk update tasks:', err)
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTaskIds.size} tasks?`)) {
      setTasks(prev => prev.filter(t => !selectedTaskIds.has(t.id)))
      setSelectedTaskIds(new Set())
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput 
          placeholder="Filter tasks..." 
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Bulk Action Bar */}
          {selectedTaskIds.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-gold/10 border border-accent-gold/20 rounded-lg animate-in fade-in slide-in-from-right-4 duration-300">
              <span className="text-xs font-bold text-accent-gold mr-2">{selectedTaskIds.size} selected</span>
              <select 
                className="text-xs bg-bg-card border border-white/10 rounded px-2 py-1 text-text-primary focus:outline-none"
                onChange={(e) => {
                  if (e.target.value) handleBulkStatusChange(e.target.value as TaskStatus)
                  e.target.value = "" // reset select
                }}
              >
                <option value="">Set status...</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
              <button 
                onClick={handleBulkDelete}
                className="p-1.5 text-text-secondary hover:text-status-red hover:bg-status-red/10 rounded transition-colors"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center p-1 bg-bg-card border border-white/5 rounded-lg">
            <button 
              onClick={() => setViewMode('table')}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'table' ? 'bg-accent-gold text-bg-primary' : 'text-text-secondary hover:text-text-primary')}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'kanban' ? 'bg-accent-gold text-bg-primary' : 'text-text-secondary hover:text-text-primary')}
            >
              <LayoutIcon className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 bg-bg-elevated border border-accent-gold/20 px-4 py-2 rounded-xl text-xs font-bold text-text-primary hover:bg-bg-elevated/80 transition-all ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-elevated/50 border-b border-white/10">
                  <th className="py-4 pl-4 pr-1 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedTaskIds.size === filteredTasks.length && filteredTasks.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/10 bg-bg-primary text-accent-gold focus:ring-accent-gold/30 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Task Detail</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Assignee</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Deadline</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Notes</th>
                  <th className="py-4 pl-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {isCreating && (
                  <TaskCreator 
                    onAdd={handleAddTask} 
                    onCancel={() => setIsCreating(false)} 
                    categories={CATEGORIES}
                    members={members}
                  />
                )}
                
                {Object.entries(groupedTasks).map(([category, catTasks]) => {
                  const isCollapsed = collapsedCategories.has(category)
                  
                  return (
                    <React.Fragment key={category}>
                      {/* Category Header Row */}
                      <tr className="bg-white/[0.01] border-b border-white/5 group/header cursor-pointer" onClick={() => toggleCategory(category)}>
                        <td colSpan={7} className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="text-text-secondary group-hover/header:text-text-primary transition-colors">
                              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <span className="text-xs font-bold text-accent-gold uppercase tracking-widest">{category}</span>
                            <span className="text-[10px] text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-full">{catTasks.length}</span>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Task Rows */}
                      {!isCollapsed && catTasks.map(task => (
                        <TaskRow 
                          key={task.id} 
                          task={task} 
                          members={members}
                          isSelected={selectedTaskIds.has(task.id)}
                          onToggleSelect={toggleSelectTask}
                          onUpdate={handleUpdateTask} 
                        />
                      ))}
                    </React.Fragment>
                  )
                })}

                {filteredTasks.length === 0 && !isCreating && (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CheckSquare className="w-8 h-8 text-text-secondary opacity-30 mb-3" />
                        <p className="text-text-secondary text-sm">No tasks found. Try adjusting your filter or add a new task.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px] pb-4 overflow-x-auto">
          <KanbanColumn status="not_started" label="Not Started" tasks={filteredTasks.filter(t => t.status === 'not_started')} members={members} onUpdate={handleUpdateTask} />
          <KanbanColumn status="in_progress" label="In Progress" tasks={filteredTasks.filter(t => t.status === 'in_progress')} members={members} onUpdate={handleUpdateTask} />
          <KanbanColumn status="blocked" label="Blocked" tasks={filteredTasks.filter(t => t.status === 'blocked')} members={members} onUpdate={handleUpdateTask} />
          <KanbanColumn status="completed" label="Completed" tasks={filteredTasks.filter(t => t.status === 'completed')} members={members} onUpdate={handleUpdateTask} />
        </div>
      )}
    </div>
  )
}
