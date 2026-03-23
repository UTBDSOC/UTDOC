'use client'

import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  onChange: (value: string) => void
  defaultValue?: string
  className?: string
  debounceTime?: number
}

export default function SearchInput({
  placeholder = 'Search...',
  onChange,
  defaultValue = '',
  className,
  debounceTime = 300
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(value)
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [value, debounceTime, onChange])

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 w-4 h-4 text-text-secondary pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-elevated border border-white/10 rounded-md py-2 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      )}
    </div>
  )
}
