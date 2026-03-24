'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Users, 
  Settings, 
  ChevronRight,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockEvents } from '@/lib/mock-data'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  // Determine if we are on an event detail page and get the event details
  const isEventDetail = pathname?.startsWith('/events/') && pathname !== '/events/new'
  const eventId = isEventDetail ? pathname.split('/').pop() : null
  const activeEvent = eventId ? mockEvents.find(e => e.id === eventId) : null

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-bg-card border-r border-white/5 flex flex-col z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center font-bold text-bg-primary">
            U
          </div>
          <span className="font-bold text-text-primary tracking-tight">UTSBDSOC</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/events' && pathname?.startsWith('/events'))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-accent-gold/10 text-accent-gold shadow-[0_0_15px_rgba(232,197,71,0.05)]' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-accent-gold' : 'text-text-secondary group-hover:text-text-primary')} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1 h-4 bg-accent-gold rounded-full shadow-[0_0_8px_#E8C547]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Active Event Indicator */}
      {activeEvent && (
        <div className="px-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 rounded-xl bg-bg-elevated border border-white/5">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Active Event</p>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse shrink-0",
                activeEvent.status === 'active' ? 'bg-status-green' : 
                activeEvent.status === 'planning' ? 'bg-status-yellow' : 'bg-status-gray'
              )} />
              <span className="text-sm font-semibold text-text-primary truncate" title={activeEvent.name}>
                {activeEvent.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Profile/Logout */}
      <div className="p-4 border-t border-white/5">
        <button onClick={() => window.location.href = '/login'} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-status-red hover:bg-status-red/5 transition-all duration-200 group">
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  )
}
