import { required } from './modifiers'
import { boolean, number, string } from './types'

describe('types', () => {
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
