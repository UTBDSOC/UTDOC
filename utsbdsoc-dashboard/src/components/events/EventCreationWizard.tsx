'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ClipboardCheck, 
  UserPlus, 
  Search,
  Check,
  Layout
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockMembers } from '@/lib/mock-data'
import DatePicker from '@/components/shared/DatePicker'
import StatusBadge from '@/components/shared/StatusBadge'

// Form Schema
const eventFormSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  date: z.string().min(1, 'Please select a date'),
  venue: z.string().optional(),
  estimated_attendance: z.number().min(0).optional(),
  description: z.string().optional(),
  collab_clubs: z.string().optional(),
  main_contact_id: z.string().min(1, 'Please select a main contact'),
  tasks: z.array(z.object({
    title: z.string(),
    category: z.string(),
    isChecked: z.boolean()
  })),
  team_assignments: z.array(z.object({
    member_id: z.string(),
    role: z.string()
  }))
})

type EventFormValues = z.infer<typeof eventFormSchema>

const taskCategories = [
  { 
    name: 'General', 
    tasks: ['Venue booking', 'Date selection', 'Availability updates', 'Budget planning'] 
  },
  { 
    name: 'Contracts & Proposals', 
    tasks: ['Sponsorship proposal', 'Sponsorship contract', 'Event proposal (EOP)', 'Risk assessment', 'Food handling certificate', 'Grant application', 'Inter-club agreement'] 
  },
  { 
    name: 'Marketing', 
    tasks: ['Theme/name brainstorm', 'Poster design', 'Social media posts', 'Marketing timeline', 'Reels/video', 'Website listing'] 
  },
  { 
    name: 'Event Program', 
    tasks: ['Runsheet', 'Performers/speakers', 'Media coverage', 'Floor plan'] 
  }
]

export default function EventCreationWizard() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      date: '',
      venue: '',
      estimated_attendance: 0,
      description: '',
      collab_clubs: '',
      main_contact_id: '',
      tasks: taskCategories.flatMap(cat => 
        cat.tasks.map(task => ({ title: task, category: cat.name, isChecked: true }))
      ),
      team_assignments: []
    }
  })

  const { fields: taskFields } = useFieldArray({
    control,
    name: "tasks"
  })

  const onSubmit = (data: EventFormValues) => {
    console.log('Submitting data:', data)
    // Simulate API call
    setTimeout(() => {
      router.push('/events')
    }, 1000)
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center flex-1 relative">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all relative z-10 shadow-lg',
            step >= i ? 'bg-accent-gold text-bg-primary' : 'bg-bg-elevated text-text-secondary border border-white/5'
          )}>
            {step > i ? <Check className="w-5 h-5" /> : i}
          </div>
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors',
            step >= i ? 'text-accent-gold' : 'text-text-secondary'
          )}>
            {i === 1 ? 'Details' : i === 2 ? 'Tasks' : i === 3 ? 'Team' : 'Review'}
          </span>
          {i < 4 && (
            <div className={cn(
              'absolute top-5 left-1/2 w-full h-[2px] -z-0',
              step > i ? 'bg-accent-gold shadow-[0_0_10px_#E8C547]' : 'bg-white/5'
            )} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Event Name</label>
                <input 
                  {...register('name')}
                  placeholder="e.g. Boishakhi Mela 2026"
                  className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
                />
                {errors.name && <p className="text-[10px] text-status-red font-bold px-1">{errors.name.message}</p>}
              </div>
              <DatePicker 
                label="Event Date"
                value={watch('date')}
                onChange={(val) => setValue('date', val)}
                error={errors.date?.message}
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input 
                    {...register('venue')}
                    placeholder="e.g. UTS Great Hall"
                    className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Estimated Attendance</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input 
                    type="number"
                    {...register('estimated_attendance', { valueAsNumber: true })}
                    className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Description</label>
              <textarea 
                {...register('description')}
                rows={3}
                placeholder="Briefly describe the purpose of this event..."
                className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Main Society Contact</label>
                <select 
                  {...register('main_contact_id')}
                  className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner appearance-none"
                >
                  <option value="">Select a member...</option>
                  {mockMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.full_name} ({m.role})</option>
                  ))}
                </select>
                {errors.main_contact_id && <p className="text-[10px] text-status-red font-bold px-1">{errors.main_contact_id.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Collaborating Clubs</label>
                <input 
                  {...register('collab_clubs')}
                  placeholder="e.g. UTS Music Society, UTS Foodies"
                  className="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-text-primary">Task Templates</h3>
              <p className="text-xs text-text-secondary italic">Deselect tasks you don't need for this event.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {taskCategories.map((cat) => (
                <div key={cat.name} className="space-y-4">
                  <h4 className="text-xs font-bold text-accent-gold uppercase tracking-widest border-l-2 border-accent-gold pl-3">{cat.name}</h4>
                  <div className="space-y-2">
                    {taskFields.filter(f => f.category === cat.name).map((field, idx) => {
                      const absoluteIndex = taskFields.findIndex(f => f.id === field.id)
                      return (
                        <label 
                          key={field.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                            watch(`tasks.${absoluteIndex}.isChecked`) 
                              ? "bg-bg-elevated border-accent-gold/20 text-text-primary" 
                              : "bg-transparent border-white/5 text-text-secondary"
                          )}
                        >
                          <input 
                            type="checkbox"
                            {...register(`tasks.${absoluteIndex}.isChecked`)}
                            className="w-4 h-4 rounded border-white/10 bg-bg-primary text-accent-gold focus:ring-accent-gold/30"
                          />
                          <span className="text-sm font-medium">{field.title}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-bg-card border border-white/5 rounded-2xl p-8 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Team Assignment</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Assign members to this event. You can also define specific roles and default task owners.
              </p>
              <div className="space-y-3 text-left">
                {mockMembers.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                        <img src={m.avatar_url} alt={m.full_name} />
                      </div>
                      <span className="text-sm font-semibold">{m.full_name}</span>
                    </div>
                    <StatusBadge status="completed" className="bg-accent-gold/10 text-accent-gold" />
                  </div>
                ))}
                <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:border-accent-gold/50 transition-all uppercase tracking-widest">
                  Add Member to Event
                </button>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-accent-gold/5 border border-accent-gold/20 rounded-2xl p-6 flex items-start gap-4">
              <ClipboardCheck className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Ready to Create</h3>
                <p className="text-sm text-text-secondary">Review your event parameters before finalizing. Auto-assigned tasks will be generated immediately.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Event Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Name</span>
                    <span className="text-sm font-bold text-text-primary">{watch('name')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Date</span>
                    <span className="text-sm font-bold text-text-primary">{watch('date')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Venue</span>
                    <span className="text-sm font-bold text-text-primary">{watch('venue') || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Attendance</span>
                    <span className="text-sm font-bold text-text-primary">{watch('estimated_attendance')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Configuration</h4>
                <div className="space-y-3">
                   <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Tasks Generated</span>
                    <span className="text-sm font-bold text-text-primary">{watch('tasks').filter(t => t.isChecked).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Assigned Members</span>
                    <span className="text-sm font-bold text-text-primary">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">EOP Checklist</span>
                    <span className="text-sm font-bold text-status-green">Automatic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-bg-card border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            {renderStepContent()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={step === 1 ? () => router.back() : prevStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Previous Step'}
          </button>
          
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-bg-elevated border border-accent-gold/30 text-sm font-bold text-text-primary hover:bg-bg-elevated/80 transition-all shadow-lg shadow-black/20"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-accent-gold text-bg-primary text-sm font-bold hover:bg-accent-gold/90 transition-all shadow-xl shadow-accent-gold/10"
            >
              Create Event
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
