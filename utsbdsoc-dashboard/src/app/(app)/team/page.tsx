/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { Plus, Users, ShieldAlert } from 'lucide-react'
import { mockMembers, mockTasks } from '@/lib/mock-data'
import { Member, MemberRole } from '@/types'
import MemberList from '@/components/team/MemberList'
import InviteMemberModal from '@/components/team/InviteMemberModal'
import AvailabilityGrid from '@/components/team/AvailabilityGrid'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(members[0])
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isEditingRole, setIsEditingRole] = useState(false)

  const handleRoleChange = (newRole: MemberRole) => {
    if (!selectedMember) return
    const updatedMember = { ...selectedMember, role: newRole }
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m))
    setSelectedMember(updatedMember)
    setIsEditingRole(false)
  }

  const handleRemoveMember = () => {
    if (!selectedMember) return
    setMembers(prev => prev.filter(m => m.id !== selectedMember.id))
    setSelectedMember(null)
    setIsRemoveDialogOpen(false)
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-sans leading-tight">Society Team</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage society members, roles, and view availability schedules.
          </p>
        </div>
        
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent-gold px-6 py-3 text-sm font-bold text-bg-primary transition-all hover:bg-accent-gold/90 shadow-lg shadow-accent-gold/10"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Member List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/5 rounded-xl text-text-secondary">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">Directory</h2>
          </div>
          <MemberList 
            members={members} 
            tasks={mockTasks} 
            onSelectMember={(member) => {
              setSelectedMember(member)
              setIsEditingRole(false)
            }} 
          />
        </div>

        {/* Right Column: Member Details & Availability */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/5 rounded-xl text-text-secondary">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">Member Profile</h2>
          </div>

          {selectedMember ? (
            <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Profile Header */}
              <div className="relative h-24 bg-gradient-to-br from-bg-elevated to-bg-card border-b border-white/5">
                <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full border-4 border-bg-card overflow-hidden bg-bg-elevated shadow-xl">
                  {selectedMember.avatar_url ? (
                    <img src={selectedMember.avatar_url} alt={selectedMember.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary text-xl font-bold bg-white/5">
                      {selectedMember.full_name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-12 p-6">
                <h3 className="text-xl font-bold text-text-primary mb-1">{selectedMember.full_name}</h3>
                <p className="text-sm text-text-secondary mb-4">{selectedMember.email}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-bg-elevated/50 border border-white/5 rounded-xl p-3 relative">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Role</span>
                    {isEditingRole ? (
                      <select 
                        autoFocus
                        onBlur={() => setIsEditingRole(false)}
                        onChange={(e) => handleRoleChange(e.target.value as MemberRole)}
                        defaultValue={selectedMember.role}
                        className="w-full bg-bg-card border border-accent-gold/30 rounded px-1 py-0.5 text-xs font-semibold text-accent-gold focus:outline-none absolute bottom-2 left-2 right-2 w-[calc(100%-16px)]"
                      >
                        <option value="member">Member</option>
                        <option value="team_lead">Team Lead</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-sm font-semibold text-accent-gold capitalize">{selectedMember.role.replace('_', ' ')}</span>
                    )}
                  </div>
                  <div className="bg-bg-elevated/50 border border-white/5 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Team</span>
                    <span className="text-sm font-semibold text-text-primary capitalize">{selectedMember.team}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingRole(!isEditingRole)} 
                    className="flex-1 py-2 rounded-lg border border-white/10 text-xs font-bold text-text-primary hover:bg-white/5 transition-colors"
                  >
                    {isEditingRole ? 'Cancel' : 'Edit Role'}
                  </button>
                  <button 
                    onClick={() => setIsRemoveDialogOpen(true)} 
                    className="flex-1 py-2 rounded-lg border border-status-red/20 text-xs font-bold text-status-red hover:bg-status-red/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-bg-card border border-white/5 rounded-2xl p-12 text-center text-text-secondary flex flex-col items-center">
              <Users className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-sm">Select a member to view details</p>
            </div>
          )}

          {/* Availability Grid */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 delay-100">
            <AvailabilityGrid />
          </div>
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />

      <ConfirmDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        onConfirm={handleRemoveMember}
        title="Remove Member?"
        description={`Are you sure you want to remove ${selectedMember?.full_name} from the dashboard? They will lose access immediately.`}
        confirmText="Yes, remove"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  )
}
