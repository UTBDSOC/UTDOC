'use client'

import React from 'react'
import { TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: TaskStatus
  interactive?: boolean
  onChange?: (status: TaskStatus) => void
  className?: string
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  not_started: {
    label: 'Not Started',
    className: 'bg-status-gray/20 text-status-gray',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-status-yellow/20 text-status-yellow',
  },
  blocked: {
    label: 'Blocked',
    className: 'bg-status-red/20 text-status-red',
  },
  completed: {
    label: 'Completed',
    className: 'bg-status-green/20 text-status-green',
  },
}

export default function StatusBadge({ status, interactive, onChange, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  if (interactive) {
    return (
      <select
        value={status}
        onChange={(e) => onChange?.(e.target.value as TaskStatus)}
        className={cn(
          'appearance-none px-2.5 py-0.5 rounded-full text-xs font-medium border-none cursor-pointer focus:ring-1 focus:ring-accent-gold outline-none',
          config.className,
          className
        )}
      >
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <option key={key} value={key} className="bg-bg-elevated text-text-primary">
            {label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium inline-block',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
