import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import {
  PlainTasksDefinition,
  TaskDefinition,
  defineTasks,
  Context,
  args,
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

describe('tasks', () => {
  it('calls a task', () => {
    process.argv = ['bin', 'file', 'fake', '--alpha=value', '-b=true']

    const { tasks } = defineTasks()

    const tasksMock = {
      fake: vi.fn(),
    }

    expect(tasksMock.fake).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake).toBeCalledTimes(1)
  })

  it('calls tasks in sequence when task is an array of tasks', async () => {
    process.argv = ['bin', 'file', 'alpha']

    const { tasks } = defineTasks()

    const order: string[] = []
    const beta = vi.fn(() => order.push('beta'))
    const gamma = vi.fn(() => order.push('gamma'))
    const delta = vi.fn(() => order.push('delta'))
    const tasksMock = {
      alpha: [beta, gamma, delta],
    }

    expect(order).toEqual([])
    await tasks(tasksMock)
    expect(order).toEqual(['beta', 'gamma', 'delta'])
  })

  it('calls a default task when passing no param', () => {
    process.argv = ['bin', 'file']

    const { tasks } = defineTasks()

    const tasksMock = {
      default: vi.fn(),
    }

    expect(tasksMock.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.default).toBeCalledTimes(1)
  })

  it('calls a task in namespace using namespace function', () => {
    process.argv = ['bin', 'file', 'fake:alpha']

    const { tasks, namespace } = defineTasks()

    const namespacedTasks = { alpha: vi.fn() }

    const tasksMock = namespace('fake', ({ tasks }) => {
      return tasks(namespacedTasks)
    })

    expect(namespacedTasks.alpha).not.toHaveBeenCalled()
    tasks({ ...tasksMock })
    expect(namespacedTasks.alpha).toBeCalledTimes(1)
  })

  it('calls a task in namespace without namespace function', () => {
    process.argv = ['bin', 'file', 'fake:alpha']

    const { tasks } = defineTasks()

    const tasksMock = {
      fake: {
        alpha: vi.fn(),
      },
    }

    expect(tasksMock.fake.alpha).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake.alpha).toBeCalledTimes(1)
  })

  it('calls a default task in namespace', () => {
    process.argv = ['bin', 'file', 'fake']
    const { tasks } = defineTasks()

    const tasksMock = {
      fake: {
        default: vi.fn(),
      },
    }

    expect(tasksMock.fake.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake.default).toBeCalledTimes(1)
  })

  it('throws an error when no task name is informed and no default task exists', async () => {
    process.argv = ['bin', 'file']

    const { tasks } = defineTasks()

    const tasksMock = {
      fake: vi.fn(),
    }

    await expect(() => tasks(tasksMock)).rejects.toThrowError(
      new TaskNameNotInformedError(),
    )
  })

  it('throws an error when task name is informed but task does not exist', async () => {
    process.argv = ['bin', 'file', 'alpha']

    const { tasks } = defineTasks()

    const tasksMock = {
      beta: vi.fn(),
    }

    await expect(() => tasks(tasksMock)).rejects.toThrowError(
      new TaskNotFoundError('alpha'),
    )
  })

  it('each task receives context as parameter', () => {
    process.argv = ['bin', 'file', 'fake']

    const { tasks } = defineTasks()

    const tasksMock = {
      fake: vi.fn(),
    }

    tasks(tasksMock)
    expect(tasksMock.fake).toHaveBeenCalledWith(
      new Map([
        [
          'argv',
          {
            errors: [],
            options: {
              help: false,
            },
            params: ['fake'],
          },
        ],
      ]),
    )
  })

  it('should share context between tasks calls tasks in sequence', async () => {
    process.argv = ['bin', 'file', 'alpha', '--fake=1']

    function mapToObj(map: any) {
      const obj = {}
      for (let [k, v] of map) {
        if (v instanceof Map) {
          obj[k] = mapToObj(v)
        } else {
          obj[k] = v
        }
      }
      return obj
    }

    const { tasks } = defineTasks()

    let betaContext
    const beta = vi.fn((ctx: Context) => {
      betaContext = mapToObj(ctx)
      ctx.set('red', 'red-value')
    })
    let gammaContext
    const gamma = vi.fn((ctx: Context) => {
      gammaContext = mapToObj(ctx)
      ctx.set('green', 'green-value')
    })
    let deltaContext
    const delta = vi.fn((ctx: Context) => {
      deltaContext = mapToObj(ctx)
    })

    const tasksMock = {
      alpha: [beta, gamma, delta],
    }

    await tasks(tasksMock)
    expect(betaContext).toEqual({
      argv: {
        errors: [],
        options: {
          fake: 1,
          help: false,
        },
        params: ['alpha'],
      },
    })
    expect(gammaContext).toEqual({
      argv: {
        errors: [],
        options: {
          fake: 1,
          help: false,
        },
        params: ['alpha'],
      },
      red: 'red-value',
    })
    expect(deltaContext).toEqual({
      argv: {
        errors: [],
        options: {
          fake: 1,
          help: false,
        },
        params: ['alpha'],
      },
      red: 'red-value',
      green: 'green-value',
    })
  })

  it('should add args to task', async () => {
    const { args } = defineTasks()

    const alpha = () => {}

    // expect(definition).toEqual({})
    args(alpha, {
      options: {
        color: [type('string')],
        watch: [type('boolean')],
        id: [type('number')],
      },
    })
    // expect(definition).toEqual({
    //   alpha: {
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
    //         id: [
    //           {
    //             name: 'type',
    //             type: 'CONFIG',
    //             value: 'number',
    //           },
    //         ],
    //         watch: [
    //           {
    //             name: 'type',
    //             type: 'CONFIG',
    //             value: 'boolean',
    //           },
    //         ],
    //       },
    //     },
    //     description: '',
    //     name: 'alpha',
    //   },
    // })
  })

  it('should fill minimum args for each task when args in not defined', async () => {
    process.argv = ['bin', 'file', 'fake:alpha']
    const { tasks } = defineTasks()

    const tasksMock = {
      fake: {
        alpha: vi.fn(),
      },
    }

    // expect(definition).toEqual({})
    await tasks(tasksMock)
    // expect(definition).toEqual({
    //   'fake:alpha': {
    //     argsDefinition: {
    //       options: {
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
    //     name: 'fake:alpha',
    //   },
    // })
  })

  it('should add args to task in namespace', async () => {
    const { namespace } = defineTasks()

    namespace('fake', ({ tasks, args }) => {
      const alpha = () => {}
      args(alpha, {
        options: {
          color: [type('string')],
          watch: [type('boolean')],
          id: [type('number')],
        },
      })
      return tasks({ alpha })
    })

    // expect(definition).toEqual({
    //   'fake:alpha': {
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
    //         id: [
    //           {
    //             name: 'type',
    //             type: 'CONFIG',
    //             value: 'number',
    //           },
    //         ],
    //         watch: [
    //           {
    //             name: 'type',
    //             type: 'CONFIG',
    //             value: 'boolean',
    //           },
    //         ],
    //       },
    //     },
    //     description: '',
    //     name: 'alpha',
    //   },
    // })
  })
})
