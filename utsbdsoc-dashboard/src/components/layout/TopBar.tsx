'use client'

import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onToggleSidebar?: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'President\'s Command Centre',
  '/events': 'Event Management',
  '/my-tasks': 'My Active Tasks',
  '/team': 'Society Members',
  '/settings': 'Application Settings',
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 h-16 bg-bg-primary/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-white/5 text-text-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary tracking-tight font-sans">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center relative group">
          <Search className="absolute left-3 w-4 h-4 text-text-secondary group-focus-within:text-accent-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="bg-bg-elevated/50 border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold/30 w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors group">
          <Bell className="w-5 h-5 group-hover:text-accent-gold" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-status-red rounded-full border-2 border-bg-primary shadow-[0_0_8px_#F97066]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-text-primary leading-none">Wasif Karim</span>
            <span className="text-[10px] text-accent-gold font-mono font-bold uppercase tracking-widest mt-0.5">Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-bg-elevated border border-accent-gold/30 p-0.5 overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wasif" 
              alt="User" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
