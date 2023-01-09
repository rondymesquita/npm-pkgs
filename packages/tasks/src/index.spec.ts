import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { tasks } from './index'

describe('tasks', () => {
  it('calls a task', () => {
    process.argv = ['bin', 'file', 'alpha']

    const tasksMock = {
      alpha: jest.fn(),
    }

    expect(tasksMock.alpha).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.alpha).toBeCalledTimes(1)
  })

  it('calls tasks in sequence when task is an array of tasks', async () => {
    process.argv = ['bin', 'file', 'alpha']

    const order: string[] = []
    const beta = jest.fn(() => order.push('beta'))
    const gamma = jest.fn(() => order.push('gamma'))
    const delta = jest.fn(() => order.push('delta'))
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
      default: jest.fn(),
    }

    expect(tasksMock.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.default).toBeCalledTimes(1)
  })

  it('calls a task in namespace', () => {
    process.argv = ['bin', 'file', 'fake:alpha']

    const tasksMock = {
      fake: {
        alpha: jest.fn(),
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
        default: jest.fn(),
      },
    }

    expect(tasksMock.fake.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake.default).toBeCalledTimes(1)
  })

  it('calls a default task in namespace', () => {
    process.argv = ['bin', 'file', 'fake']

    const tasksMock = {
      fake: {
        default: jest.fn(),
      },
    }

    expect(tasksMock.fake.default).not.toHaveBeenCalled()
    tasks(tasksMock)
    expect(tasksMock.fake.default).toBeCalledTimes(1)
  })

  it('throws an error when no task name is informed and no default task exists', () => {
    process.argv = ['bin', 'file']

    const tasksMock = {
      fake: jest.fn(),
    }

    expect(tasks(tasksMock)).rejects.toEqual(new TaskNameNotInformedError())
  })

  it('throws an error when task name is informed but task does not exist', () => {
    process.argv = ['bin', 'file', 'alpha']

    const tasksMock = {
      beta: jest.fn(),
    }

    expect(tasks(tasksMock)).rejects.toEqual(new TaskNotFoundError('alpha'))
  })

  it('receives context as parameter', () => {
    process.argv = ['bin', 'file', 'fake', '--alpha=value', '-b=true']

    const tasksMock = {
      fake: jest.fn(),
    }

    tasks(tasksMock)
    expect(tasksMock.fake).toHaveBeenCalledWith({
      argv: { options: { alpha: 'value', b: true }, params: ['fake'] },
    })
  })
})
