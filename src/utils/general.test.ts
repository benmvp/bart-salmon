import { normalizeMinutes } from './general'

describe('normalizeMinutes', () => {
  it('returns back the number', () => {
    expect(normalizeMinutes(10)).toBe(10)
  })

  it('returns back string versin of a number as the number', () => {
    expect(normalizeMinutes('15')).toBe(15)
  })

  it('returns 0 for non-parsable string', () => {
    expect(normalizeMinutes('Leaving')).toBe(0)
  })
})
