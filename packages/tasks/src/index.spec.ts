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
    expect(tasksMock.fake).toHaveBeenCalledWith({
      values: new Map(),
      _: {
        argv: {
          errors: [],
          options: {
            help: false,
          },
          params: ['fake'],
        },
      },
    })
  })

  it('should underscore be readonly', () =>
    new Promise((done) => {
      process.argv = ['bin', 'file', 'alpha']

      const tasksMock: TaskDefinition = {
        alpha: vi.fn().mockImplementationOnce((ctx: Context) => {
          expect(
            () =>
              // @ts-ignore
              (ctx._.test = 'fake'),
          ).toThrowError(
            new Error('Cannot add property test, object is not extensible'),
          )
          done({})
        }),
      }

      tasks(tasksMock)
    }))
})
