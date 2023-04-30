import { defineValidator } from '.'
import { checkType, checkValue } from './argcheck'
import { defaultValue, help, required, type } from './modifiers'
import { describe, it, expect } from 'vitest'

describe('argcheck', () => {
  it('should be okay if value have the correct type', () => {
    expect(() => checkType('alpha', [type('number')], 1)).not.toThrow()
    expect(checkType('alpha', [type('number')], 1)).toEqual(undefined)
  })

  it('should be exception when value have incorrect type', () => {
    expect(() => {
      checkType('alpha', [type('number')], 'string')
    }).toThrow(new Error('"alpha" must be of type "number"'))
  })

  it('should be okay if value is not required', () => {
    expect(() => checkValue('alpha', [type('number')], 1)).not.toThrow()
    expect(checkType('alpha', [type('number')], 1)).toEqual(undefined)
  })

  it('should be okay if value is required and it is informed', () => {
    expect(() =>
      checkValue('alpha', [type('number'), required(true)], 1),
    ).not.toThrow()
  })

  it('should be exception if value is required and it is not informed', () => {
    expect(() =>
      checkValue('alpha', [type('number'), required(true)], null),
    ).toThrow(new Error('"alpha" is required'))
    expect(() =>
      checkValue('alpha', [type('number'), required(true)], undefined),
    ).toThrow(new Error('"alpha" is required'))
  })
})
