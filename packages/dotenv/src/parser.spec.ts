import { describe, expect, it } from 'vitest'

import { isBoolean, parseDotenvFile, parseValue } from './parser'

describe('utils', () => {
  it('should parse values', () => {
    expect(parseValue('1')).toEqual(1)
    expect(parseValue('')).toEqual(null)
    expect(parseValue('true')).toEqual(true)
    expect(parseValue('false')).toEqual(false)
    expect(parseValue('0')).toEqual(0)
    expect(parseValue('value')).toEqual('value')
    expect(parseValue('alpha, beta, gamma')).toEqual('alpha, beta, gamma')
  })
  it('should parse quoted values', () => {
    expect(parseValue('"1"')).toEqual(1)
    expect(parseValue('"true"')).toEqual(true)
    expect(parseValue('"false"')).toEqual(false)
    expect(parseValue('"0"')).toEqual(0)
    expect(parseValue('"value"')).toEqual('value')
    expect(parseValue('"alpha, beta, gamma"')).toEqual('alpha, beta, gamma')
  })

  it('should check if string is boolean', () => {
    expect(isBoolean('true')).toEqual(true)
    expect(isBoolean('false')).toEqual(true)
  })
  it('should parse dotenv file contents', () => {
    expect(
      parseDotenvFile(`
		ALPHA=1
		BETA="2"
		GAMMA=true
		DELTA="false"
		EPS=1,2,3
		ZETA=0
		ETA=
		`)
    ).toEqual({
      ALPHA: 1,
      BETA: 2,
      GAMMA: true,
      DELTA: false,
      EPS: '1,2,3',
      ZETA: 0,
    })
  })
})
