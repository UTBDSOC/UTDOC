'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNav from './MobileNav'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Pages that shouldn't have the AppShell layout (like login)
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth')

  if (isAuthPage) {
    return <main className="min-h-screen bg-bg-primary">{children}</main>
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 w-64 bg-bg-card z-50 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-60 transition-all duration-300">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-6 pb-24 lg:pb-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
        
        {/* Mobile Navigation Bar */}
        <MobileNav />
      </div>
    </div>
  )
}
