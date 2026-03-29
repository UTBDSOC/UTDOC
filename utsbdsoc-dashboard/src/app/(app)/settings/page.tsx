'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Bell, MessageSquare, Mail, ShieldAlert, User, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

type Tab = 'notifications' | 'integrations' | 'account'

interface MeData {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  notification_prefs: {
    email?: boolean
    in_app?: boolean
    discord?: boolean
    reminder_days?: number
    discord_webhook?: string
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('notifications')
  const [me, setMe] = useState<MeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Notification States
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [discordNotifs, setDiscordNotifs] = useState(true)
  const [inAppNotifs, setInAppNotifs] = useState(true)
  const [reminderDays, setReminderDays] = useState(3)

  // Integration States
  const [discordWebhook, setDiscordWebhook] = useState('')
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [testSuccess, setTestSuccess] = useState(false)

  // Account States
  const [displayName, setDisplayName] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Wasif")

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          const json = await res.json()
          const data = json.data as MeData
          setMe(data)
          setDisplayName(data.full_name)
          setAvatarUrl(data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.full_name}`)
          const prefs = data.notification_prefs || {}
          setEmailNotifs(prefs.email !== false)
          setInAppNotifs(prefs.in_app !== false)
          setDiscordNotifs(prefs.discord !== false)
          setReminderDays(prefs.reminder_days ?? 3)
          setDiscordWebhook(prefs.discord_webhook || '')
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  const savePrefs = useCallback(async (prefs: Record<string, unknown>) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_prefs: prefs }),
      })
      if (res.ok) {
        const json = await res.json()
        setMe(json.data)
      }
    } catch (err) {
      console.error('Failed to save preferences:', err)
    } finally {
      setIsSaving(false)
    }
  }, [])

  const handleToggle = (key: string, value: boolean) => {
    if (key === 'email') setEmailNotifs(value)
    else if (key === 'in_app') setInAppNotifs(value)
    else if (key === 'discord') setDiscordNotifs(value)
    savePrefs({ [key]: value })
  }

  const handleReminderDaysChange = (days: number) => {
    setReminderDays(days)
    savePrefs({ reminder_days: days })
  }

  const handleTestWebhook = async () => {
    if (!discordWebhook) return
    setIsTestingWebhook(true)
    try {
      await savePrefs({ discord_webhook: discordWebhook })
      setTestSuccess(true)
      setTimeout(() => setTestSuccess(false), 3000)
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName }),
      })
      if (res.ok) {
        const json = await res.json()
        setMe(json.data)
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setAvatarUrl(objectUrl)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_prefs: { account_deletion_requested: true } }),
      })
    } catch {
      // best effort
    }
    setIsDeleteDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-text-secondary text-sm">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold text-text-primary font-sans leading-tight">Settings</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your personal preferences and society-wide integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column: Navigation */}
        <div className="space-y-2 md:col-span-1">
          <button
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all border",
              activeTab === 'notifications'
                ? "bg-accent-gold/10 text-accent-gold border-accent-gold/20 shadow-inner"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5 border-transparent"
            )}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all border",
              activeTab === 'integrations'
                ? "bg-status-purple/10 text-status-purple border-status-purple/20 shadow-inner"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5 border-transparent"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Integrations
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all border",
              activeTab === 'account'
                ? "bg-status-blue/10 text-status-blue border-status-blue/20 shadow-inner"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5 border-transparent"
            )}
          >
            <User className="w-4 h-4" />
            Account
          </button>
        </div>

        {/* Right Column: Settings Content */}
        <div className="md:col-span-3 space-y-8 min-h-[400px]">

          {/* Notification Preferences */}
          {activeTab === 'notifications' && (
            <section className="bg-bg-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2 bg-white/5 rounded-xl text-text-secondary">
                  <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">Notification Preferences</h2>
                {isSaving && <span className="text-[10px] text-accent-gold font-bold uppercase tracking-widest ml-auto">Saving...</span>}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Email Notifications</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Receive daily summaries and urgent alerts via email.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('email', !emailNotifs)}
                    className={cn("w-12 h-6 rounded-full transition-colors relative", emailNotifs ? "bg-status-green" : "bg-white/10")}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", emailNotifs ? "left-7" : "left-1")} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">In-App Notifications</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Show real-time alerts within the dashboard.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('in_app', !inAppNotifs)}
                    className={cn("w-12 h-6 rounded-full transition-colors relative", inAppNotifs ? "bg-status-green" : "bg-white/10")}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", inAppNotifs ? "left-7" : "left-1")} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Discord Pings</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Get mentioned in the executive Discord server.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('discord', !discordNotifs)}
                    className={cn("w-12 h-6 rounded-full transition-colors relative", discordNotifs ? "bg-status-green" : "bg-white/10")}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", discordNotifs ? "left-7" : "left-1")} />
                  </button>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Deadline Reminders</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Days before a task is due to send a reminder.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={reminderDays}
                      onChange={(e) => handleReminderDaysChange(parseInt(e.target.value) || 0)}
                      className="w-20 bg-bg-elevated border border-white/10 rounded-lg py-2 px-3 text-sm text-center text-text-primary focus:outline-none focus:border-accent-gold/50"
                    />
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Days</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Discord Integration (Admin Only) */}
          {activeTab === 'integrations' && (
            <section className="bg-bg-card border border-status-purple/20 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-status-purple" />

              <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-status-purple/10 rounded-xl text-status-purple">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      Discord Webhook <span className="bg-white/10 text-text-secondary px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold">Admin</span>
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">Connect the dashboard to your society&apos;s Discord server.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Webhook URL</label>
                  <input
                    type="password"
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-status-purple/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-text-secondary italic">This webhook will be used for automated task and EOP deadline reminders.</p>
                  <button
                    onClick={handleTestWebhook}
                    disabled={!discordWebhook || isTestingWebhook || testSuccess}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-status-purple/10 text-status-purple text-xs font-bold hover:bg-status-purple/20 transition-all disabled:opacity-50 border border-status-purple/20 shrink-0"
                  >
                    {isTestingWebhook ? 'Saving...' : testSuccess ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : 'Save & Test'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Account Profile */}
          {activeTab === 'account' && (
            <section className="bg-bg-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2 bg-status-blue/10 rounded-xl text-status-blue">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">Account Details</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-bg-elevated overflow-hidden shadow-xl relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover bg-white/5 transition-opacity group-hover:opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center">Update</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-status-blue hover:text-status-blue/80 transition-colors uppercase tracking-widest"
                  >
                    Change Avatar
                  </button>
                </div>

                <div className="space-y-4 flex-1 w-full">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Display Name</label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onBlur={handleSaveProfile}
                      className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-status-blue/50 transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        readOnly
                        value={me?.email || ''}
                        className="w-full bg-bg-elevated/30 border border-transparent rounded-xl py-3 pl-12 pr-4 text-sm text-text-secondary cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-status-red/10 flex justify-end">
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-status-red/20 text-xs font-bold text-status-red hover:bg-status-red/10 transition-all"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Request Account Deletion
                </button>
              </div>
            </section>
          )}

        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        description="Are you sure you want to request account deletion? An admin will need to approve this action. You will lose access to all event data immediately."
        confirmText="Yes, delete account"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  )
}
