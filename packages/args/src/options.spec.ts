import { required } from './modifiers'
import { helpOption, string, boolean, number } from './options'
import { describe, it, expect } from 'vitest'

describe('options', () => {
  it('should create help option', () => {
    expect(helpOption()).toEqual({
      modifiers: [
        {
          name: 'help',
          type: 'CONFIG',
          value: 'Show help message',
        },
        {
          name: 'defaultvalue',
          type: 'CONFIG',
          value: false,
        },
      ],
      name: 'help',
      type: 'boolean',
    })
  })

  it('should create help option with custom name and description', () => {
    expect(helpOption('alpha', 'alpha description')).toEqual({
      modifiers: [
        {
          name: 'help',
          type: 'CONFIG',
          value: 'alpha description',
        },
        {
          name: 'defaultvalue',
          type: 'CONFIG',
          value: false,
        },
      ],
      name: 'alpha',
      type: 'boolean',
    })
  })

  it('should get an option type', () => {
    expect(string('alpha', [required()])).toEqual({
      name: 'alpha',
      type: 'string',
      modifiers: [
        {
          name: 'required',
          type: 'CONFIG',
          value: true,
        },
      ],
    })
    expect(number('alpha')).toEqual({
      name: 'alpha',
      type: 'number',
      modifiers: [],
    })
    expect(boolean('alpha')).toEqual({
      name: 'alpha',
      type: 'boolean',
      modifiers: [],
    })
  })
})
