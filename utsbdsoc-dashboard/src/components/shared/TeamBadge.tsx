import React from 'react'
import { TeamName } from '@/types'
import { cn } from '@/lib/utils'

interface TeamBadgeProps {
  team: TeamName
  className?: string
}

const teamConfig: Record<TeamName, { label: string; colorClass: string }> = {
  events: { label: 'Events', colorClass: 'bg-status-red' },
  marketing: { label: 'Marketing', colorClass: 'bg-status-purple' },
  finance: { label: 'Finance', colorClass: 'bg-status-green' },
  sponsorship: { label: 'Sponsorship', colorClass: 'bg-status-blue' },
  it: { label: 'IT', colorClass: 'bg-status-pink' },
  general: { label: 'General', colorClass: 'bg-status-gray' },
}

export default function TeamBadge({ team, className }: TeamBadgeProps) {
  const config = teamConfig[team]
  
  return (
    <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded bg-bg-elevated border border-white/5', className)}>
      <div className={cn('w-1.5 h-1.5 rounded-full', config.colorClass)} />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        {config.label}
      </span>
    </div>
  )
}
