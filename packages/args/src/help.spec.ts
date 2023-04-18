import { defineValidator } from '.'
import { buildHelp, buildHelpForOption } from './help'
import { defaultValue, help, required } from './modifiers'
import { boolean, number, string } from './options'

describe('help', () => {
  it('should build a help from option', () => {
    expect(
      buildHelpForOption(
        number('alpha', [defaultValue(5), help('alpha description')]),
      ),
    ).toEqual({
      description: {
        padding: [0],
        text: 'alpha description',
      },
      modifiers: {
        padding: [0],
        text: '[number], [defaultvalue:5]',
      },
      name: {
        padding: [0],
        text: '--alpha',
      },
    })
  })
  it('should build help from definition', () => {
    const max = defineValidator('max', (rule: number, value: number) => {
      return value <= rule
    })

    const definition = {
      name: 'mycli',
      usage: 'mycli [options]',
      options: [
        number('alpha', [defaultValue(5), max(6)]),
        string('beta', [defaultValue('beta'), help('beta description')]),
        boolean('gama', [defaultValue(true), required()]),
        boolean('ajuda', [help('Show help message')]),
      ],
    }
    expect(buildHelp(definition)).toEqual({
      header: [
        {
          padding: [0],
          text: 'mycli',
        },
        {
          padding: [0],
          text: 'Usage: mycli [options]',
        },
        {
          padding: [1],
          text: 'Options:',
        },
      ],
      body: [
        {
          description: {
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
          description: {
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
          description: {
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
          description: {
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
