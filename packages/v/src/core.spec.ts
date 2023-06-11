import { vi, expect, it, describe } from 'vitest'
import { schema, v } from './core'

describe('core', () => {
  it('should define primitive string schema', () => {
    const alpha = v().string().length(5)
    expect(() => alpha.parse('1')).not.toThrowError()
    expect(() => alpha.parse(1)).toThrowError()
    expect(() => alpha.parse('short')).not.toThrowError()
    expect(() => alpha.parse('loooooong')).toThrowError()
  })

  it('should define object schema', () => {
    const alpha = schema({
      beta: v().string().length(5),
    })

    expect(() =>
      alpha.parse({
        beta: 'short',
      }),
    ).not.toThrow()
    expect(() =>
      alpha.parse({
        beta: 'loooooong',
      }),
    ).toThrow()
  })
})
