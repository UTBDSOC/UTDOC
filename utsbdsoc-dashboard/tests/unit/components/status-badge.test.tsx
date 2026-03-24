import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/render'
import { StatusBadge } from '@/components/status-badge'

describe('StatusBadge', () => {
  it('renders NOT_STARTED status', () => {
    render(<StatusBadge status="NOT_STARTED" />)
    expect(screen.getByText('Not Started')).toBeInTheDocument()
  })

  it('renders COMPLETED status', () => {
    render(<StatusBadge status="COMPLETED" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders IN_PROGRESS status', () => {
    render(<StatusBadge status="IN_PROGRESS" />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders BLOCKED status', () => {
    render(<StatusBadge status="BLOCKED" />)
    expect(screen.getByText('Blocked')).toBeInTheDocument()
  })

  it('renders PLANNING status', () => {
    render(<StatusBadge status="PLANNING" />)
    expect(screen.getByText('Planning')).toBeInTheDocument()
  })

  it('falls back to raw status for unknown values', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />)
    expect(screen.getByText('UNKNOWN_STATUS')).toBeInTheDocument()
  })
})
