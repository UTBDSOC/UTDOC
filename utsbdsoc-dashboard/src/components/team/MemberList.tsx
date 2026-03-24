/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { Member, Task } from '@/types'
import { MoreVertical, Mail, User as UserIcon } from 'lucide-react'
import TeamBadge from '@/components/shared/TeamBadge'
import { cn } from '@/lib/utils'

interface MemberListProps {
  members: Member[]
  tasks: Task[]
  onSelectMember: (member: Member) => void
}

export default function MemberList({ members, tasks, onSelectMember }: MemberListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.team.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-white/5 bg-bg-elevated/30">
        <input 
          type="text" 
          placeholder="Search members by name, role, or team..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm bg-bg-card border border-white/10 rounded-lg py-2 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
        />
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-bg-elevated/50 border-b border-white/10 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              <th className="py-4 pl-6 pr-3">Member</th>
              <th className="py-4 px-3">Role</th>
              <th className="py-4 px-3">Team</th>
              <th className="py-4 px-3">Active Workload</th>
              <th className="py-4 pl-3 pr-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMembers.map(member => {
              const activeTasks = tasks.filter(t => t.assignee_id === member.id && t.status !== 'completed').length
              
              return (
                <tr 
                  key={member.id} 
                  onClick={() => onSelectMember(member)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-bg-elevated shrink-0">
                        {member.avatar_url ? (
                          <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-secondary">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                          {member.full_name}
                        </span>
                        <span className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                      member.role === 'admin' ? "bg-accent-gold/10 text-accent-gold" :
                      member.role === 'team_lead' ? "bg-white/10 text-text-primary" :
                      "text-text-secondary border border-white/10"
                    )}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <TeamBadge team={member.team} />
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono",
                        activeTasks > 5 ? "bg-status-red/20 text-status-red" :
                        activeTasks > 0 ? "bg-white/10 text-text-primary" :
                        "text-text-secondary opacity-50"
                      )}>
                        {activeTasks}
                      </div>
                      <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold">Tasks</span>
                    </div>
                  </td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-text-secondary italic">
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
