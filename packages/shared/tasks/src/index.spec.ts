import { ArgsDefinition, defineArgs } from '@rondymesquita/args'
import { describe, expect, it, vi } from 'vitest'

import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { Context, defineTasks } from './index'

const createSut = () => {
  return defineTasks(defineArgs)
}

describe('tasks', () => {
  it('calls a task', () => {
    process.argv = [
      'bin', 'file', 'fake', '--alpha=value', '-b=true',
    ]

    const { tasks, } = createSut()

    const tasksMock = { fake: vi.fn(), }

    expect(tasksMock.fake).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake).toBeCalledTimes(1)
  })

  it('calls tasks in sequence when task is an array of tasks', async() => {
    process.argv = ['bin', 'file', 'alpha',]

    const { tasks, } = createSut()

    const order: string[] = []
    const beta = vi.fn(() => order.push('beta'))
    const gamma = vi.fn(() => order.push('gamma'))
    const delta = vi.fn(() => order.push('delta'))
    const tasksMock = { alpha: [beta, gamma, delta,], }

    expect(order).toEqual([])
    await tasks(tasksMock)
    expect(order).toEqual(['beta', 'gamma', 'delta',])
  })

  it('calls a default task when passing no name', () => {
    process.argv = ['bin', 'file',]

    const { tasks, } = createSut()

    const tasksMock = { default: vi.fn(), }

    expect(tasksMock.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.default).toBeCalledTimes(1)
  })

  it('calls a task in namespace', () => {
    process.argv = ['bin', 'file', 'fake:alpha',]

    const { tasks, } = createSut()

    const tasksMock = { fake: { alpha: vi.fn(), }, }

    expect(tasksMock.fake.alpha).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake.alpha).toBeCalledTimes(1)
  })

  it('calls a default task in namespace', () => {
    process.argv = ['bin', 'file', 'fake',]
    const { tasks, } = createSut()

    const tasksMock = { fake: { default: vi.fn(), }, }

    expect(tasksMock.fake.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake.default).toBeCalledTimes(1)
  })

  it('throws an error when no task name is informed and no default task exists', async() => {
    process.argv = ['bin', 'file',]

    const { tasks, } = createSut()

    const tasksMock = { fake: vi.fn(), }

    await expect(() => tasks(tasksMock)).rejects.toThrowError(
      new TaskNameNotInformedError()
    )
  })

  it('throws an error when task name is informed but task does not exist', async() => {
    process.argv = ['bin', 'file', 'alpha',]

    const { tasks, } = createSut()

    const tasksMock = { beta: vi.fn(), }

    await expect(() => tasks(tasksMock)).rejects.toThrowError(
      new TaskNotFoundError('alpha')
    )
  })

  it('each task receives options and context as parameter', () => {
    process.argv = [
      'bin',
      'file',
      'fake',
      '--alpha=true',
      '--beta=betavalue',
      '--gamma=1',
    ]

    const { tasks, } = createSut()

    const tasksMock = { fake: vi.fn(), }

    tasks(tasksMock)
    expect(tasksMock.fake).toHaveBeenCalledWith(
      {
        help: false,
        alpha: true,
        beta: 'betavalue',
        gamma: 1,
      },
      new Map([
        [
          'argv',
          {
            errors: [],
            options: {
              help: false,
              alpha: true,
              beta: 'betavalue',
              gamma: 1,
            },
            params: ['fake',],
          },
        ],
      ])
    )
  })

  it('should share context between tasks calls tasks in sequence', async() => {
    process.argv = [
      'bin', 'file', 'alpha', '--fake=1',
    ]

    function mapToObj(map: any) {
      const obj = {}
      for (const [k, v,] of map) {
        if (v instanceof Map) {
          obj[k] = mapToObj(v)
        } else {
          obj[k] = v
        }
      }
      return obj
    }

    const { tasks, } = createSut()

    let betaContext
    const beta = vi.fn((options, ctx: Context) => {
      betaContext = mapToObj(ctx)
      ctx.set('red', 'red-value')
    })
    let gammaContext
    const gamma = vi.fn((options, ctx: Context) => {
      gammaContext = mapToObj(ctx)
      ctx.set('green', 'green-value')
    })
    let deltaContext
    const delta = vi.fn((options, ctx: Context) => {
      deltaContext = mapToObj(ctx)
    })

    const tasksMock = { alpha: [beta, gamma, delta,], }

    await tasks(tasksMock)
    expect(betaContext).toEqual({
      argv: {
        errors: [],
        options: {
          fake: 1,
          help: false,
        },
        params: ['alpha',],
      },
    })
    expect(gammaContext).toEqual({
      argv: {
        errors: [],
        options: {
          fake: 1,
          help: false,
        },
        params: ['alpha',],
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
        params: ['alpha',],
      },
      red: 'red-value',
      green: 'green-value',
    })
  })

  it('should fill minimum args for each task when args in not defined', async() => {
    process.argv = ['bin', 'file', 'fake:alpha',]
    const { tasks, } = createSut()

    const tasksMock = { fake: { alpha: vi.fn(), }, }

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

  it('should call help', async() => {
    const argv = {
      params: [],
      options: { help: [], },
    }
    const defineArgsMock = {
      parseArgs: vi.fn().mockImplementationOnce(() => argv),
      showHelp: vi.fn(),
      showErrors: vi.fn(),
    }
    const { tasks, } = defineTasks(
      (argsDefinition: ArgsDefinition) => defineArgsMock
    )

    const alpha = vi.fn()
    expect(defineArgsMock.showHelp).not.toBeCalled()
    tasks({ alpha, })
    expect(defineArgsMock.showHelp).toBeCalledTimes(1)
    expect(defineArgsMock.showHelp).toBeCalledWith()
  })
})
