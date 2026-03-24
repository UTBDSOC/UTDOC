import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/render'
import { ProgressRing } from '@/components/progress-ring'

describe('ProgressRing', () => {
  it('renders with correct percentage', () => {
    render(<ProgressRing percentage={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders with 0 percentage', () => {
    render(<ProgressRing percentage={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders with 100 percentage', () => {
    render(<ProgressRing percentage={100} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('applies custom size', () => {
    const { container } = render(<ProgressRing percentage={50} size={100} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '100')
    expect(svg).toHaveAttribute('height', '100')
  })

  it('applies custom className', () => {
    const { container } = render(<ProgressRing percentage={50} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
