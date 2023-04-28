import { vi, describe, it, expect } from 'vitest'
import { HelpMessages, buildGlobalHelp } from './help'
import { string } from '@rondymesquita/args'

describe('help', () => {
  it('asdsa', () => {
    const helpMessages: HelpMessages = {
      'fake:task': {
        name: 'fake:task',
        description: 'fake task help message',
        argsDefinition: {
          name: 'color',
          usage: 'fake:task --color=red',
          options: [string('color')],
        },
      },
    }
    const globalHelp = buildGlobalHelp(helpMessages)
    expect(globalHelp).toEqual({
      body: [
        {
          description: {
            padding: [0],
            text: 'fake task help message',
          },
          name: {
            padding: [0],
            text: 'fake:task',
          },
          options: '[--color:string]',
        },
      ],
      header: [
        {
          padding: [1],
          text: 'Tasks:',
        },
      ],
    })
  })
})
