'use client'

import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          'p-3 rounded-full mb-4',
          isDestructive ? 'bg-status-red/10 text-status-red' : 'bg-accent-gold/10 text-accent-gold'
        )}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-lg',
              isDestructive 
                ? 'bg-status-red hover:bg-status-red/90 shadow-status-red/20' 
                : 'bg-accent-gold text-bg-primary hover:bg-accent-gold/90 shadow-accent-gold/20'
            )}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
