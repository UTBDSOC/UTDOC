'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bell, Search, Menu, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { mockNotifications } from '@/lib/mock-data'
import { cn, formatRelativeDate } from '@/lib/utils'
import Link from 'next/link'

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
  
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.is_read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'task_overdue':
        return <AlertTriangle className="w-4 h-4 text-status-red" />
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-status-blue" />
      default:
        return <Bell className="w-4 h-4 text-accent-gold" />
    }
  }

  return (
    <header className="sticky top-0 h-16 bg-bg-primary/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-white/5 text-text-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary tracking-tight font-sans hidden sm:block">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
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
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={cn(
              "relative p-2 rounded-full transition-colors group",
              isNotifOpen ? "bg-white/10 text-text-primary" : "hover:bg-white/5 text-text-secondary"
            )}
          >
            <Bell className="w-5 h-5 group-hover:text-accent-gold" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-status-red rounded-full border-2 border-bg-primary shadow-[0_0_8px_#F97066]" />
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-bg-elevated/50">
                <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-accent-gold hover:text-accent-gold/80 transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 flex gap-3 transition-colors",
                          notif.is_read ? "opacity-60 hover:opacity-100" : "bg-accent-gold/5"
                        )}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className={cn(
                            "p-2 rounded-full",
                            notif.is_read ? "bg-bg-elevated" : "bg-bg-card border border-white/10 shadow-inner"
                          )}>
                            {getNotifIcon(notif.type)}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className={cn("text-xs font-bold line-clamp-1", notif.is_read ? "text-text-secondary" : "text-text-primary")}>
                              {notif.title}
                            </h4>
                            <span className="text-[9px] font-bold text-text-secondary whitespace-nowrap">
                              {formatRelativeDate(notif.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {notif.body}
                          </p>
                          {!notif.is_read && (
                            <div className="pt-2 flex gap-3">
                              {notif.link && (
                                <Link 
                                  href={notif.link}
                                  onClick={() => {
                                    markAsRead(notif.id)
                                    setIsNotifOpen(false)
                                  }}
                                  className="text-[10px] font-bold text-accent-gold hover:underline uppercase tracking-widest"
                                >
                                  View Details
                                </Link>
                              )}
                              <button 
                                onClick={() => markAsRead(notif.id)}
                                className="text-[10px] font-bold text-text-secondary hover:text-text-primary uppercase tracking-widest"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-status-green/50 mb-2" />
                    <p className="text-sm font-semibold text-text-primary">All caught up!</p>
                    <p className="text-xs text-text-secondary mt-1">You have no new notifications.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-text-primary leading-none">Wasif Karim</span>
            <span className="text-[10px] text-accent-gold font-mono font-bold uppercase tracking-widest mt-0.5">Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-bg-elevated border border-accent-gold/30 p-0.5 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
