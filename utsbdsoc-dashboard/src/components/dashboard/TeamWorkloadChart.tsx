'use client'

import React from 'react'
import { Task, Member } from '@/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users } from 'lucide-react'

interface TeamWorkloadChartProps {
  tasks: Task[]
  members: Member[]
}

export default function TeamWorkloadChart({ tasks, members }: TeamWorkloadChartProps) {
  // Calculate workload per member
  const data = members.map(member => {
    const memberTasks = tasks.filter(t => t.assignee_id === member.id && t.status !== 'completed')
    return {
      name: member.full_name.split(' ')[0], // First name
      tasks: memberTasks.length,
      role: member.role,
      fullName: member.full_name
    }
  }).sort((a, b) => b.tasks - a.tasks).slice(0, 5) // Top 5 busiest

  if (data.length === 0) return null

  // Custom colors based on role/load
  const getBarColor = (tasksCount: number) => {
    if (tasksCount > 5) return 'var(--color-status-red)' // High load
    if (tasksCount > 2) return 'var(--color-accent-gold)' // Medium load
    return 'var(--color-status-blue)' // Normal load
  }

  return (
    <div className="bg-bg-card border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/5 rounded-xl text-text-secondary">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-primary">Team Workload</h3>
          <p className="text-xs text-text-secondary mt-0.5">Active tasks assigned per member</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-bg-elevated border border-white/10 p-3 rounded-lg shadow-xl">
                      <p className="font-bold text-text-primary text-sm">{data.fullName}</p>
                      <p className="text-xs text-text-secondary uppercase tracking-widest mt-1 mb-2">{data.role}</p>
                      <p className="text-lg font-mono font-bold text-accent-gold">{data.tasks} Active Tasks</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="tasks" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.tasks)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
