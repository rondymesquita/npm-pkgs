import { log } from 'console'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { PlainTaskDefinition, TaskDefinition, tasks, Context } from './index'
import { vi, describe, it, expect } from 'vitest'

describe('tasks', () => {
  it('calls a task', () => {
    process.argv = ['bin', 'file', 'fake', '--alpha=value', '-b=true']

    const tasksMock = {
      fake: vi.fn(),
    }

    expect(tasksMock.fake).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake).toBeCalledTimes(1)
  })

  it('calls tasks in sequence when task is an array of tasks', async () => {
    process.argv = ['bin', 'file', 'alpha']

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

    const tasksMock = {
      default: vi.fn(),
    }

    expect(tasksMock.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.default).toBeCalledTimes(1)
  })

  it('calls a task in namespace', () => {
    process.argv = ['bin', 'file', 'fake:alpha']

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

    const tasksMock = {
      fake: vi.fn(),
    }

    await expect(() => tasks(tasksMock)).rejects.toThrowError(
      new TaskNameNotInformedError(),
    )
  })

  it('throws an error when task name is informed but task does not exist', async () => {
    process.argv = ['bin', 'file', 'alpha']

    const tasksMock = {
      beta: vi.fn(),
    }

    await expect(() => tasks(tasksMock)).rejects.toThrowError(
      new TaskNotFoundError('alpha'),
    )
  })

  it('each task receives context as parameter', () => {
    process.argv = ['bin', 'file', 'fake']

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

  it('should share values between tasks calls tasks in sequence', async () => {
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
})
