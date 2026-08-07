import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import KpiCard from '../../components/admin/KpiCard'

describe('KpiCard', () => {
  it('renders title and value (server render)', () => {
    const html = renderToString(<KpiCard title="Bookings" value={42} />)
    expect(html).toContain('Bookings')
    expect(html).toContain('42')
  })
})
