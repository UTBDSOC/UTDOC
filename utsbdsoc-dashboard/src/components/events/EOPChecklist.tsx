'use client'

import React, { useState, useMemo } from 'react'
import { Event, EOPItem as EOPItemType } from '@/types'
import EOPItem from './EOPItem'
import { AlertTriangle, FileCheck2 } from 'lucide-react'
import { differenceInBusinessDays } from 'date-fns'

interface EOPChecklistProps {
  event: Event
  initialItems: EOPItemType[]
}

const DEFAULT_ITEMS = [
  { key: 'risk_assessment', label: 'Risk Assessment', required: true },
  { key: 'food_handling', label: 'Food Handling Certificate', required: true },
  { key: 'facilities_request', label: 'Facilities Request', required: true },
  { key: 'run_sheet', label: 'Run Sheet', required: true },
  { key: 'external_list', label: 'External List', required: false },
  { key: 'floor_plan', label: 'Floor Plan', required: false },
  { key: 'emergency_plan', label: 'Emergency Plan', required: true },
]

export default function EOPChecklist({ event, initialItems }: EOPChecklistProps) {
  // Merge initial items with default structure
  const [items, setItems] = useState<EOPItemType[]>(() => {
    return DEFAULT_ITEMS.map(def => {
      const existing = initialItems.find(i => i.item_key === def.key)
      if (existing) return existing
      return {
        id: `eop-${def.key}-${Date.now()}`,
        event_id: event.id,
        item_key: def.key,
        label: def.label,
        is_required: def.required,
        is_completed: false,
      }
    })
  })

  const { completedCount, totalCount, progress, hasWarning } = useMemo(() => {
    const requiredItems = items.filter(i => i.is_required)
    const completedRequired = requiredItems.filter(i => i.is_completed).length
    
    // Warning logic: less than 5 business days and missing mandatory items
    let warning = false
    if (event.date) {
      const daysUntil = differenceInBusinessDays(new Date(event.date), new Date())
      if (daysUntil <= 5 && completedRequired < requiredItems.length) {
        warning = true
      }
    }

    return {
      completedCount: items.filter(i => i.is_completed).length,
      totalCount: items.length,
      progress: Math.round((items.filter(i => i.is_completed).length / items.length) * 100),
      hasWarning: warning
    }
  }, [items, event.date])

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    // Optimistic update
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, is_completed: isCompleted } : item
    ))

    try {
      const res = await fetch(`/api/events/${event.id}/eop-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: isCompleted }),
      })

      if (res.ok) {
        const json = await res.json()
        setItems(prev => prev.map(item => item.id === id ? json.data : item))
      } else {
        // Revert on failure
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, is_completed: !isCompleted } : item
        ))
      }
    } catch (err) {
      console.error('Failed to update EOP item:', err)
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, is_completed: !isCompleted } : item
      ))
    }
  }

  const handleUploadFile = async (id: string, file: File) => {
    // For now, create an object URL as placeholder
    // In production, upload to Supabase Storage first
    const fileUrl = URL.createObjectURL(file)

    setItems(prev => prev.map(item =>
      item.id === id ? {
        ...item,
        is_completed: true,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString()
      } : item
    ))

    try {
      const res = await fetch(`/api/events/${event.id}/eop-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_completed: true,
          file_url: fileUrl,
          file_name: file.name,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        setItems(prev => prev.map(item => item.id === id ? json.data : item))
      }
    } catch (err) {
      console.error('Failed to update EOP item file:', err)
    }

    return fileUrl
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Progress */}
      <div className="bg-bg-card border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent-gold/10 text-accent-gold shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1">EOP Compliance</h2>
            <p className="text-sm text-text-secondary">
              Event Operations Package requirements. Must be completed before the event.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-text-secondary">Progress</span>
            <span className="text-accent-gold">{completedCount} / {totalCount}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-gold transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {hasWarning && (
        <div className="bg-status-red/10 border border-status-red/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
          <AlertTriangle className="w-5 h-5 text-status-red shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-status-red">Urgent Action Required</h4>
            <p className="text-xs text-text-secondary mt-1">
              This event is less than 5 business days away and mandatory EOP items are still incomplete. Submit immediately to ActivateUTS.
            </p>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-bg-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
          Required Documents
        </h3>
        <div className="space-y-3">
          {items.map(item => (
            <EOPItem 
              key={item.id} 
              item={item} 
              onToggleComplete={handleToggleComplete}
              onUploadFile={handleUploadFile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
