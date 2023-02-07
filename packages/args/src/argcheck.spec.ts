import { defineValidator } from '.'
import { checkType, checkValue } from './argcheck'
import { defaultValue, help, required } from './modifiers'
import { boolean, number, string } from './types'

describe('argcheck', () => {
  it('should be okay if value have the correct type', () => {
    expect(() => checkType(number('alpha'), 1)).not.toThrow()
    expect(checkType(number('alpha'), 1)).toEqual(undefined)
  })

  it('should be exception when value have incorrect type', () => {
    expect(() => {
      checkType(number('alpha'), 'string')
    }).toThrow(new Error('"alpha" must be of type "number"'))
  })

  it('should be okay if value is not required', () => {
    expect(() => checkValue(number('alpha'), 1)).not.toThrow()
    expect(checkType(number('alpha'), 1)).toEqual(undefined)
  })

  it('should be okay if value is required and it is informed', () => {
    expect(() => checkValue(number('alpha', [required(true)]), 1)).not.toThrow()
  })

  it('should be exception if value is required and it is not informed', () => {
    expect(() => checkValue(number('alpha', [required(true)]), null)).toThrow(
      new Error('"alpha" is required'),
    )
    expect(() =>
      checkValue(number('alpha', [required(true)]), undefined),
    ).toThrow(new Error('"alpha" is required'))
  })
})
