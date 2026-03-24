'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Task, TaskStatus, Member } from '@/types'

interface TaskCreatorProps {
  onAdd: (task: Partial<Task>) => void
  onCancel: () => void
  categories: string[]
  members: Member[]
}

export default function TaskCreator({ onAdd, onCancel, categories, members }: TaskCreatorProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0] || 'General')
  const [assigneeId, setAssigneeId] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({
      title,
      category,
      assignee_id: assigneeId || undefined,
      deadline: deadline || undefined,
      status: 'not_started' as TaskStatus,
      notes: ''
    })
  }

  return (
    <tr className="bg-bg-elevated/30 border-b border-accent-gold/20">
      <td colSpan={7} className="p-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-4 p-4">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="flex-1 bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 w-32 appearance-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 w-32 appearance-none"
          >
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 w-36 custom-calendar-picker"
          />

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-lg text-text-secondary hover:text-status-red hover:bg-status-red/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="p-2 rounded-lg bg-accent-gold text-bg-primary hover:bg-accent-gold/90 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}
