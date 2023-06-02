import {
  parseArgs,
  defineArgs,
  required,
  defaultValue,
  defineValidator,
  type,
} from './index'

import { describe, it, expect, vi, expectTypeOf } from 'vitest'

describe('test', () => {
  it('parses options', () => {
    const options = parseArgs(
      '--alpha=1 -a=0 --beta=1.0 -b=0.5 --gama=gama -g=gama --delta -d --epsilon=true -e=false'.split(
        ' ',
      ),
    )
    expect(options).toEqual({
      options: {
        a: 0,
        alpha: 1,
        b: 0.5,
        beta: 1,
        d: true,
        delta: true,
        g: 'gama',
        gama: 'gama',
        e: false,
        epsilon: true,
      },
      params: [],
      errors: [],
    })
  })
  it('parses parameters', () => {
    const argv = parseArgs(
      '--alpha=alphavalue -b=false fulano sicrano'.split(' '),
    )
    expect(argv).toEqual({
      options: {
        alpha: 'alphavalue',
        b: false,
      },
      params: ['fulano', 'sicrano'],
      errors: [],
    })
  })
  it('defines args with options', () => {
    const { parseArgs } = defineArgs({
      options: {
        alpha: [type('number')],
      },
    })

    const argv = parseArgs('--alpha=1'.split(' '))
    expect(argv).toEqual({
      options: {
        alpha: 1,
      },
      params: [],
      errors: [],
    })
  })
  it('fill default values when option is not passed', () => {
    const { parseArgs } = defineArgs({
      options: {
        alpha: [type('number'), defaultValue(5)],
        beta: [type('string'), defaultValue('beta')],
        gamma: [type('boolean'), defaultValue(true)],
      },
    })

    const argv = parseArgs([])
    expect(argv).toEqual({
      options: {
        alpha: 5,
        beta: 'beta',
        gamma: true,
      },
      params: [],
      errors: [],
    })
  })
  it('returns type errors when values are not passed', () => {
    const { parseArgs } = defineArgs({
      options: {
        alpha: [type('number')],
        beta: [type('string')],
        gamma: [type('boolean')],
      },
    })

    const argv = parseArgs([])
    expect(argv).toEqual({
      options: {},
      params: [],
      errors: [
        '"alpha" must be of type "number"',
        '"beta" must be of type "string"',
        '"gamma" must be of type "boolean"',
      ],
    })
  })
  it('returns type errors when type does not match', () => {
    const { parseArgs } = defineArgs({
      options: {
        alpha: [type('string')],
        beta: [type('boolean')],
        gamma: [type('number')],
      },
    })

    const argv = parseArgs('--alpha=1 --beta=1.0 --gama=gama'.split(' '))
    expect(argv).toEqual({
      options: {
        alpha: 1,
        beta: 1,
        gama: 'gama',
      },
      params: [],
      errors: [
        '"alpha" must be of type "string"',
        '"beta" must be of type "boolean"',
        '"gamma" must be of type "number"',
      ],
    })
  })
  it('returns errors when constraint does not satisfy', () => {
    const { parseArgs } = defineArgs({
      options: {
        alpha: [type('string')],
        beta: [type('boolean'), required(true)],
      },
    })

    const argv = parseArgs('--alpha=alpha --gamma=6'.split(' '))
    expect(argv).toEqual({
      options: {
        alpha: 'alpha',
        gamma: 6,
      },
      params: [],
      errors: ['"beta" is required'],
    })
  })

  it('should return error on invalid custom user constraint', () => {
    const max = defineValidator('max', (rule: number, value: number) => {
      return value <= rule
    })

    const { parseArgs } = defineArgs({
      options: {
        gamma: [type('number'), max(3)],
      },
    })

    const argv = parseArgs('--gamma=6'.split(' '))
    expect(argv).toEqual({
      options: {
        gamma: 6,
      },
      params: [],
      errors: [
        '"gamma" must satisfy "max" constraint. Expected:"3". Received:"6".',
      ],
    })
  })

  it('should return typed options with custom type', () => {
    interface CustomOptions {
      alpha: string
      gamma: number
    }

    const argv = parseArgs('--alpha=alpha --gamma=6'.split(' '))
    const options = argv.options as CustomOptions
    expect(options.alpha).toEqual('alpha')
    expect(options.gamma).toEqual(6)
  })

  it('should return typed options with any type', () => {
    const argv = parseArgs('--alpha=alpha --gamma=6'.split(' '))
    expect(argv.options.alpha).toEqual('alpha')
    expect(argv.options.gamma).toEqual(6)
  })
})
