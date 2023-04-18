import { defineValidator } from './validator'

describe('validator', () => {
  it('defines a number validator', () => {
    const max = defineValidator('max', (rule: number, value: number) => {
      return value <= rule
    })

    expect(max(4)).toEqual({
      name: 'max',
      type: 'VALIDATOR',
      validate: expect.any(Function),
      value: 4,
    })

    expect(max(4).validate(3)).toBeTruthy()
    expect(max(4).validate(4)).toBeTruthy()
    expect(max(4).validate(5)).toBeFalsy()
  })
  it('defines a string validator', () => {
    const length = defineValidator('length', (rule: number, value: string) => {
      return value.length <= rule
    })

    expect(length(4)).toEqual({
      name: 'length',
      type: 'VALIDATOR',
      validate: expect.any(Function),
      value: 4,
    })

    expect(length(6).validate('alpha')).toBeTruthy()
    expect(length(5).validate('alpha')).toBeTruthy()
    expect(length(4).validate('alpha')).toBeFalsy()
  })
  it('defines an array validator', () => {
    const includes = defineValidator(
      'includes',
      (rule: string, value: Array<string>) => {
        return value.includes(rule)
      },
    )

    expect(includes('alpha')).toEqual({
      name: 'includes',
      type: 'VALIDATOR',
      validate: expect.any(Function),
      value: 'alpha',
    })

    expect(includes('alpha').validate(['alpha', 'beta'])).toBeTruthy()
    expect(includes('alpha').validate(['beta'])).toBeFalsy()
  })
})
