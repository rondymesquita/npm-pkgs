import { parseArgs, defineArgs, number } from './index'

describe('test', () => {
  it('parses integers', () => {
    const options = parseArgs('--alpha=1 -b=0'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: 1,
        b: 0,
      },
      params: [],
    })
  })
  it('parses double', () => {
    const options = parseArgs('--alpha=1.0 -b=0.5'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: 1.0,
        b: 0.5,
      },
      params: [],
    })
  })
  it('parses string', () => {
    const options = parseArgs('--alpha=alphavalue -b=bvalue'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: 'alphavalue',
        b: 'bvalue',
      },
      params: [],
    })
  })
  it('parses boolean', () => {
    const options = parseArgs('--alpha -b'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: true,
        b: true,
      },
      params: [],
    })
  })
  it('parses boolean values', () => {
    const options = parseArgs('--alpha=true -b=false'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: true,
        b: false,
      },
      params: [],
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
    })
  })
  it('defines args parsing options', () => {
    const parseArgs = defineArgs({})

    const argv = parseArgs(
      '--alpha=1 -a=0 --beta=1.0 -b=0.5 --gama=gama -g=gama --delta -d --epsilon=true -e=false'.split(
        ' ',
      ),
    )
    expect(argv).toEqual({
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
    })
  })

  it('throws an error when type', () => {
    const parseArgs = defineArgs({
      options: [number('alpha')],
    })

    const assert = () => parseArgs('--gama=gama'.split(' '))

    expect(assert()).rejects.toEqual(new Error('alpha'))
  })
})
