import args from './index'

describe('test', () => {
  it('parses integers', () => {
    const options = args('--alpha=1 -b=0'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: 1,
        b: 0,
      },
      params: [],
    })
  })
  it('parses double', () => {
    const options = args('--alpha=1.0 -b=0.5'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: 1.0,
        b: 0.5,
      },
      params: [],
    })
  })
  it('parses string', () => {
    const options = args('--alpha=alphavalue -b=bvalue'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: 'alphavalue',
        b: 'bvalue',
      },
      params: [],
    })
  })
  it('parses boolean', () => {
    const options = args('--alpha -b'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: true,
        b: true,
      },
      params: [],
    })
  })
  it('parses boolean values', () => {
    const options = args('--alpha=true -b=false'.split(' '))
    expect(options).toEqual({
      options: {
        alpha: true,
        b: false,
      },
      params: [],
    })
  })
  it('parses parameters', () => {
    const options = args(
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

  it('parses parameters', () => {
    const options = args(
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
})
