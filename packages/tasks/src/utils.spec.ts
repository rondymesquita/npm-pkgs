import { defineTasksFunction } from './utils'

import { vi, describe, it, expect } from 'vitest'

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
