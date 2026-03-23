'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Users, 
  Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dash', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Tasks', href: '/my-tasks', icon: CheckSquare },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-bg-card/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-2 z-40 sm:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
              isActive ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <item.icon className={cn('w-5 h-5', isActive ? 'text-accent-gold drop-shadow-[0_0_8px_rgba(232,197,71,0.5)]' : '')} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
