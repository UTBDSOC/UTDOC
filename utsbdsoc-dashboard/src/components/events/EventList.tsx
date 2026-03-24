'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, MapPin, Users, ArrowRight, Filter } from 'lucide-react'
import { Event, EventStatus } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import ProgressRing from '@/components/shared/ProgressRing'
import SearchInput from '@/components/shared/SearchInput'

interface EventListProps {
  events: Event[]
}

const tabs: { label: string; value: EventStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'Past', value: 'post_event' },
  { label: 'Archived', value: 'archived' },
]

export default function EventList({ events }: EventListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<(EventStatus | 'all')>(
    (searchParams.get('status') as EventStatus) || 'all'
  )
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = events.filter((event) => {
    const matchesStatus = activeTab === 'all' || event.status === activeTab
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <SearchInput 
          placeholder="Search events by name or venue..." 
          onChange={setSearchQuery}
          className="w-full sm:max-w-md"
        />
        
        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-bg-card border border-white/5 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                activeTab === tab.value 
                  ? 'bg-accent-gold text-bg-primary shadow-lg shadow-accent-gold/10' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="group bg-bg-card border border-white/5 rounded-2xl p-5 hover:border-accent-gold/30 hover:bg-bg-elevated/50 transition-all cursor-pointer shadow-lg shadow-black/20 relative overflow-hidden flex flex-col"
            >
              {/* Event Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      event.status === 'active' ? 'bg-status-green' : 
                      event.status === 'planning' ? 'bg-status-yellow' : 'bg-status-gray'
                    )} />
                    <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-accent-gold transition-colors">
                      {event.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-accent-gold group-hover:text-bg-primary transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mt-auto">
                {event.venue && (
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{event.venue}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-text-secondary text-xs">
                  <Users className="w-3 h-3" />
                  <span>{event.estimated_attendance || 0} Expected</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ProgressRing percentage={(index * 37 + 13) % 100} size={36} strokeWidth={4} />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Progress</span>
                      <span className="text-xs text-text-primary font-mono">Tasks Complete</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-bg-card bg-bg-elevated overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar${i + event.id}`} 
                          alt="Team" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Ribbon */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className={cn(
                  'absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-16 h-4 opacity-10',
                  event.status === 'active' ? 'bg-status-green' : 
                  event.status === 'planning' ? 'bg-status-yellow' : 'bg-status-gray'
                )} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-bg-card border border-white/5 rounded-2xl text-center">
          <div className="p-4 rounded-full bg-white/5 mb-4">
            <Filter className="w-8 h-8 text-text-secondary opacity-30" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No events matching your filter</h3>
          <p className="text-sm text-text-secondary mt-1">Try adjusting your search or switching tabs.</p>
        </div>
      )}
    </div>
  )
}
