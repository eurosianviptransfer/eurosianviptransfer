import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

describe('Admin revamp route', () => {
  it('returns 200 from /admin-revamp', async () => {
    const res = await fetch('http://localhost:3000/admin-revamp')
    expect(res.status).toBe(200)
  })
})
