import { defineValidator } from '.'
import { buildHelp, buildHelpForOption } from './help'
import { defaultValue, help, required, type } from './modifiers'
import { describe, it, expect } from 'vitest'

describe('help', () => {
  it('should build a help from option', () => {
    expect(
      buildHelpForOption('alpha', [
        required(true),
        defaultValue(5),
        help('alpha description'),
      ]),
    ).toEqual({
      description: {
        padding: [0],
        text: 'alpha description',
      },
      modifiers: {
        padding: [0],
        text: '[required:true], [defaultvalue:5]',
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
      options: {
        alpha: [defaultValue(5), max(6), type('number')],
        beta: [defaultValue('beta'), help('beta description'), type('string')],
        gama: [defaultValue(true), required(), type('boolean')],
        ajuda: [help('Show help message'), type('boolean')],
      },
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
            text: '[type:number], [defaultvalue:5], [max:6]',
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
            text: '[type:string], [defaultvalue:beta]',
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
            text: '[type:boolean], [defaultvalue:true], [required:true]',
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
            text: '[type:boolean]',
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
