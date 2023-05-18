import { defineTasksFunction } from './functions'

import { vi, describe, it, expect } from 'vitest'
import { defineCallback } from './util'

describe('functions', () => {
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
