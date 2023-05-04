import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { defineArgsFunction, defineTasksFunction } from './functions'
import {
  PlainTasksDefinition,
  TaskDefinition,
  defineTasks,
  Context,
  // defineArgs,
} from './index'

import { Argv, Options, defineArgs, type } from '@rondymesquita/args'
import {
  vi,
  describe,
  it,
  expect,
  Mock,
  Mocked,
  MockedFunction,
  SpyInstance,
} from 'vitest'
import { defineCallback } from './util'

describe('functions', () => {
  // it('should create args functions', () => {})

  it('should define a new args function without namespace', () => {
    const alpha = () => {}
    const { args, setCallback } = defineArgsFunction()

    const mockCallback = vi.fn()
    setCallback(mockCallback)
    expect(mockCallback).not.toBeCalled()
    args(alpha, {
      options: {
        color: [type('string')],
      },
    })

    expect(mockCallback).toBeCalledWith({
      alpha: {
        argsDefinition: {
          options: {
            color: [
              {
                name: 'type',
                type: 'CONFIG',
                value: 'string',
              },
            ],
            help: [
              {
                name: 'help',
                type: 'CONFIG',
                value: 'Show help message',
              },
              {
                name: 'type',
                type: 'CONFIG',
                value: 'boolean',
              },
              {
                name: 'defaultvalue',
                type: 'CONFIG',
                value: false,
              },
            ],
          },
        },
        description: '',
        name: 'alpha',
      },
    })
  })
  it.skip('should define a new args function with namespace', () => {
    const alpha = () => {}
    const { args } = defineArgsFunction('beta')

    args(alpha, {
      options: {
        color: [type('string')],
      },
    })

    // expect(definition).toEqual({
    //   'beta:alpha': {
    //     argsDefinition: {
    //       options: {
    //         color: [
    //           {
    //             name: 'type',
    //             type: 'CONFIG',
    //             value: 'string',
    //           },
    //         ],
    //         help: [
    //           {
    //             name: 'help',
    //             type: 'CONFIG',
    //             value: 'Show help message',
    //           },
    //           {
    //             name: 'type',
    //             type: 'CONFIG',
    //             value: 'boolean',
    //           },
    //           {
    //             name: 'defaultvalue',
    //             type: 'CONFIG',
    //             value: false,
    //           },
    //         ],
    //       },
    //     },
    //     description: '',
    //     name: 'alpha',
    //   },
    // })
  })
  it('should define a new task function without namespace', () => {
    const beta = () => {}
    const gamma = () => {}
    const tasks = defineTasksFunction()

    const plainTasks = tasks({
      alpha: {
        beta,
      },
      gamma,
    })

    expect(plainTasks).toEqual({ 'alpha:beta': beta, gamma })
  })
  it('should define a new task function with namespace', () => {
    const beta = () => {}
    const gamma = () => {}
    const tasks = defineTasksFunction('delta')

    const plainTasks = tasks({
      alpha: {
        beta,
      },
      gamma,
    })

    expect(plainTasks).toEqual({
      'delta:alpha:beta': beta,
      'delta:gamma': gamma,
    })
  })
  it('should call callback', async () => {
    const [call, setCallback] = defineCallback()

    const mockCallback = vi.fn()
    setCallback(mockCallback)

    expect(mockCallback).not.toBeCalled()
    call()
    expect(mockCallback).toBeCalledTimes(1)
  })
  it('should call callback passing params', async () => {
    const [call, setCallback] = defineCallback<
      { fake: string } | { another: string }
    >()

    const mockCallback = vi.fn()
    setCallback(mockCallback)

    expect(mockCallback).not.toBeCalled()
    call({ fake: 'data' }, { another: 'data' })
    expect(mockCallback).toBeCalledTimes(1)
    expect(mockCallback).toBeCalledWith({ fake: 'data' }, { another: 'data' })
  })
})
