import { defaultValue, help, required } from './modifiers'
import { describe, it, expect } from 'vitest'

describe('modifiers', () => {
  it('should create required modifier', () => {
    expect(required()).toEqual({
      name: 'required',
      type: 'CONFIG',
      value: true,
    })
    expect(required(true)).toEqual({
      name: 'required',
      type: 'CONFIG',
      value: true,
    })
    expect(required(false)).toEqual({
      name: 'required',
      type: 'CONFIG',
      value: false,
    })
  })
  it('should create help modifier', () => {
    expect(help('help message')).toEqual({
      name: 'help',
      type: 'CONFIG',
      value: 'help message',
    })
  })
  it('should create defaultValue modifier', () => {
    expect(defaultValue('value')).toEqual({
      name: 'defaultvalue',
      type: 'CONFIG',
      value: 'value',
    })
  })
})
