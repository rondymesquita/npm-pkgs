import { isBoolean, parseValue } from './utils'

describe('utils', () => {
  it('should check if string is boolean', () => {
    expect(isBoolean('true')).toBeTruthy()
    expect(isBoolean('false')).toBeTruthy()
  })
  it('should parse boolean string', () => {
    expect(parseValue('true')).toBe(true)
    expect(parseValue('false')).toBe(false)
  })
  it('should parse zero string to zero number', () => {
    expect(parseValue('0')).toBe(0)
  })
  it('should parse any other number string to number', () => {
    expect(parseValue('1')).toBe(1)
    expect(parseValue('2')).toBe(2)
  })
  it('should parse null, undefined and empty as boolean and true', () => {
    expect(parseValue(null)).toBe(true)
    expect(parseValue(undefined)).toBe(true)
    expect(parseValue('')).toBe(true)
  })
  it('should parse string to string', () => {
    expect(parseValue('alphavalue')).toBe('alphavalue')
  })
})
