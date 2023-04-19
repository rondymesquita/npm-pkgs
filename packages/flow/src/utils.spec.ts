import { createObjectFromArray } from './utils'
import { describe, it, expect } from 'vitest'

describe('utils', () => {
  it('should convert array from object into single object', () => {
    const array = [{ alpha: 1 }, { beta: '2' }, { gamma: true }]
    expect(createObjectFromArray(array)).toEqual({
      alpha: 1,
      beta: '2',
      gamma: true,
    })
  })
})
