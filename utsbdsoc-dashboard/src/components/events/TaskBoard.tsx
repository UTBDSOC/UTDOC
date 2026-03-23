'use client'

import React, { useState } from 'react'
import { Task, Member } from '@/types'
import TaskRow from './TaskRow'
import { Search, Filter, Plus, List, Layout as LayoutIcon } from 'lucide-react'
import SearchInput from '@/components/shared/SearchInput'

interface TaskBoardProps {
  tasks: Task[]
  members: Member[]
}

export default function TaskBoard({ tasks: initialTasks, members }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput 
          placeholder="Filter tasks..." 
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />
        
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-bg-card border border-white/5 rounded-lg mr-2">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-accent-gold text-bg-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-accent-gold text-bg-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <LayoutIcon className="w-4 h-4" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 bg-bg-elevated border border-accent-gold/20 px-4 py-2 rounded-xl text-xs font-bold text-text-primary hover:bg-bg-elevated/80 transition-all">
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
                  <th className="py-4 pl-4 pr-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Task Detail</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Assignee</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Deadline</th>
                  <th className="py-4 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Notes</th>
                  <th className="py-4 pl-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskRow 
                      key={task.id} 
                      task={task} 
                      members={members} 
                      onUpdate={handleUpdateTask} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <p className="text-text-secondary text-sm">No tasks found. Try adjusting your filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
          {/* Kanban placeholder for Sprint 2 */}
          {['Not Started', 'In Progress', 'Blocked', 'Completed'].map(status => (
            <div key={status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{status}</h4>
                <span className="w-5 h-5 rounded-full bg-bg-elevated text-text-secondary text-[10px] flex items-center justify-center font-bold">0</span>
              </div>
              <div className="flex-1 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <LayoutIcon className="w-8 h-8 text-text-secondary opacity-10 mb-2" />
                <p className="text-[10px] text-text-secondary uppercase tracking-widest">Kanban coming in Sprint 2</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
