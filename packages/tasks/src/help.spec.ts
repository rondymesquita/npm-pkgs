import { vi, describe, it, expect } from 'vitest'
import { HelpMessages, buildGlobalHelp } from './help'
import { type } from '@rondymesquita/args'
import { TaskDefinition } from '.'

describe('help', () => {
  it('should build global help for tasks', () => {
    const definition: TaskDefinition = {
      'fake:task': {
        name: 'fake:task',
        description: 'fake task help message',
        argsDefinition: {
          name: 'color',
          usage: 'fake:task --color=red',
          options: { color: [type('string')] },
        },
      },
    }
    const globalHelp = buildGlobalHelp(definition)
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
