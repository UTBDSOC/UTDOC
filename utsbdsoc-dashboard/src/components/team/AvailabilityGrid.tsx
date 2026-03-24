'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']

export default function AvailabilityGrid() {
  // Mock availability data (in a real app, this would be passed as props based on the selected member)
  const isAvailable = (day: string, time: string) => {
    // Generate some deterministic but varied mock data
    const seed = day.charCodeAt(0) + time.charCodeAt(0)
    return seed % 3 !== 0 // ~66% available
  }

  return (
    <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold text-text-primary">General Availability</h3>
        <p className="text-xs text-text-secondary mt-0.5">Typical weekly schedule based on class timetable</p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest text-right pr-2"></div>
            {DAYS.map(day => (
              <div key={day} className="text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="space-y-1">
            {TIMES.map(time => (
              <div key={time} className="grid grid-cols-8 gap-1 items-center">
                <div className="text-[10px] font-bold text-text-secondary text-right pr-2 whitespace-nowrap">
                  {time}
                </div>
                {DAYS.map(day => {
                  const available = isAvailable(day, time)
                  return (
                    <div 
                      key={`${day}-${time}`} 
                      className={cn(
                        "h-8 rounded-md transition-colors",
                        available 
                          ? "bg-status-green/20 border border-status-green/30" 
                          : "bg-white/5 border border-white/5"
                      )}
                      title={`${day} ${time}: ${available ? 'Available' : 'Busy'}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 justify-end">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-green/20 border border-status-green/30" />
              <span className="text-xs text-text-secondary font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white/5 border border-white/5" />
              <span className="text-xs text-text-secondary font-medium">Busy / Class</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
