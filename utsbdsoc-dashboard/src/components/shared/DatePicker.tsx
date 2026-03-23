'use client'

import React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  error?: string
  className?: string
}

export default function DatePicker({
  value,
  onChange,
  label,
  error,
  className
}: DatePickerProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full bg-bg-elevated border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner custom-calendar-picker',
            error ? 'border-status-red/50 focus:ring-status-red/30' : ''
          )}
        />
      </div>
      {error && <p className="text-[10px] text-status-red font-medium">{error}</p>}
      
      <style jsx global>{`
        .custom-calendar-picker::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
