import { helpOption } from './options'

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
})
