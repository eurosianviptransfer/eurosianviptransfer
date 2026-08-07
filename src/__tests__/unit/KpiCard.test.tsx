import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import KpiCard from '../../components/admin/KpiCard'

describe('KpiCard', () => {
  it('renders title and value', () => {
    const { getByText } = render(<KpiCard title="Bookings" value={42} />)
    expect(getByText('Bookings')).toBeTruthy()
    expect(getByText('42')).toBeTruthy()
  })
})
