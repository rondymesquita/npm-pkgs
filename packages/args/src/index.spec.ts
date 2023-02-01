import {
  parseArgs,
  defineArgs,
  number,
  string,
  boolean,
  required,
  defaultValue,
  defineValidator,
  Validator,
} from './index'

import { promisify } from 'util'
import { exec as nodeExec, spawn } from 'child_process'
const exec = promisify(nodeExec)
// const spawn = promisify(nodeSpawn)

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
    const options = parseArgs(
      '--alpha=alphavalue -b=false fulano sicrano'.split(' '),
    )
    expect(options).toEqual({
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
      options: [number('alpha')],
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
      options: [
        number('alpha', [defaultValue(5)]),
        string('beta', [defaultValue('beta')]),
        boolean('gama', [defaultValue(true)]),
      ],
    })

    const argv = parseArgs([])
    expect(argv).toEqual({
      options: {
        alpha: 5,
        beta: 'beta',
        gama: true,
      },
      params: [],
      errors: [],
    })
  })
  it('returns type errors when values are not passed', () => {
    const { parseArgs } = defineArgs({
      options: [number('alpha'), string('beta'), boolean('gamma')],
    })

    const argv = parseArgs(''.split(''))
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
      options: [string('alpha'), boolean('beta'), number('gamma')],
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
      options: [
        string('alpha'),
        boolean('beta', [required(true)]),
        number('gamma', []),
      ],
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
