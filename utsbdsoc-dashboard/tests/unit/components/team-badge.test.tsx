import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/render'
import { TeamBadge } from '@/components/team-badge'

describe('TeamBadge', () => {
  it('renders MARKETING team', () => {
    render(<TeamBadge team="MARKETING" />)
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })

  it('renders LOGISTICS team', () => {
    render(<TeamBadge team="LOGISTICS" />)
    expect(screen.getByText('Logistics')).toBeInTheDocument()
  })

  it('renders FINANCE team', () => {
    render(<TeamBadge team="FINANCE" />)
    expect(screen.getByText('Finance')).toBeInTheDocument()
  })

  it('renders CREATIVE team', () => {
    render(<TeamBadge team="CREATIVE" />)
    expect(screen.getByText('Creative')).toBeInTheDocument()
  })

  it('renders OPERATIONS team', () => {
    render(<TeamBadge team="OPERATIONS" />)
    expect(screen.getByText('Operations')).toBeInTheDocument()
  })

  it('falls back to raw team name for unknown values', () => {
    render(<TeamBadge team="UNKNOWN_TEAM" />)
    expect(screen.getByText('UNKNOWN_TEAM')).toBeInTheDocument()
  })
})
