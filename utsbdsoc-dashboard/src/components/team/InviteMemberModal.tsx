'use client'

import React, { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { MemberRole, TeamName } from '@/types'
import { Mail, CheckCircle2 } from 'lucide-react'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [team, setTeam] = useState<TeamName>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setEmail('')
        onClose()
      }, 2000)
    }, 1000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New Member" className="max-w-md">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-status-green/10 flex items-center justify-center mb-4 text-status-green">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Invitation Sent</h3>
          <p className="text-sm text-text-secondary">
            An email has been sent to {email} with instructions to join the dashboard.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@uts.edu.au"
                required
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Assign Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner appearance-none"
              >
                <option value="member">Member</option>
                <option value="team_lead">Team Lead</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Assign Team</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value as TeamName)}
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner appearance-none"
              >
                <option value="general">General</option>
                <option value="events">Events</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="sponsorship">Sponsorship</option>
                <option value="it">IT</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!email || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-accent-gold text-bg-primary text-sm font-bold hover:bg-accent-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-accent-gold/10"
            >
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
