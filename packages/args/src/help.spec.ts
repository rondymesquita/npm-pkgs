import { defineValidator } from '.'
import { defineHelp } from './help'
import { defaultValue, help, required, showHelp } from './modifiers'
import { boolean, number, string } from './types'

describe('help', () => {
  it.only('show help', () => {
    const max = defineValidator('max', (rule: number, value: number) => {
      return value <= rule
    })

    const definition = {
      name: 'mycli',
      options: [
        number('alpha', [defaultValue(5), max(6)]),
        string('beta', [defaultValue('beta'), help('beta description')]),
        boolean('gama', [defaultValue(true), required()]),
        boolean('ajuda', [help('Show help message'), showHelp()]),
      ],
    }
    expect(defineHelp(definition)).toEqual({
      header: [
        'Usage: mycli [options]',
        {
          padding: [1],
          text: 'Options:',
        },
      ],
      body: [
        {
          message: {
            padding: [0],
            text: '',
          },
          modifiers: {
            padding: [0],
            text: '[number], [defaultvalue:5], [max:6]',
          },
          name: {
            padding: [0],
            text: '--alpha',
          },
        },
        {
          message: {
            padding: [0],
            text: 'beta description',
          },
          modifiers: {
            padding: [0],
            text: '[string], [defaultvalue:beta]',
          },
          name: {
            padding: [0],
            text: '--beta',
          },
        },
        {
          message: {
            padding: [0],
            text: '',
          },
          modifiers: {
            padding: [0],
            text: '[boolean], [defaultvalue:true], [required:true]',
          },
          name: {
            padding: [0],
            text: '--gama',
          },
        },
        {
          message: {
            padding: [0],
            text: 'Show help message',
          },
          modifiers: {
            padding: [0],
            text: '[boolean]',
          },
          name: {
            padding: [0],
            text: '--ajuda',
          },
        },
      ],
    })
  })
})
