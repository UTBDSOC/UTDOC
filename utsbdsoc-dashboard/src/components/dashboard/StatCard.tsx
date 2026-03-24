import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  trend?: 'up' | 'down' | 'neutral'
  accentColor?: string
  className?: string
}

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  accentColor = 'text-accent-gold',
  className 
}: StatCardProps) {
  return (
    <div className={cn('bg-bg-card border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group', className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
      
      <div className="flex items-start justify-between relative z-10 mb-4">
        <div className={cn('p-3 rounded-xl bg-bg-elevated border border-white/5 shadow-inner', accentColor)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={cn(
            'text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest',
            trend === 'up' ? 'bg-status-green/10 text-status-green' : 
            trend === 'down' ? 'bg-status-red/10 text-status-red' : 
            'bg-white/5 text-text-secondary'
          )}>
            {trend === 'up' ? '+12%' : trend === 'down' ? '-4%' : '~0%'}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-mono font-bold text-text-primary tracking-tight mb-1">{value}</h3>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">{label}</p>
      </div>
    </div>
  )
}
