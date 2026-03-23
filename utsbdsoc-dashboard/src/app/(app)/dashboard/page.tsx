import React from 'react'
import EmptyState from '@/components/shared/EmptyState'
import { LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bg-card border border-white/5 p-6 rounded-xl h-32 animate-pulse" />
        ))}
      </div>
      
      <EmptyState 
        icon={LayoutDashboard}
        title="Welcome to the Command Centre"
        description="This is your central hub for society operations. Sprint 4 will populate this with real-time analytics and event trackers."
        className="min-h-[400px]"
      />
    </div>
  )
}
