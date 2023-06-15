import { Context, flow, stopOnError } from './index'
import { describe, it, expect, vi } from 'vitest'

describe('flow', () => {
  it('should run a flow in sequence', () => {
    const order: Array<number> = []
    const { run } = flow([
      () => {
        order.push(1)
        return 1
      },
      () => {
        order.push(2)
      },
    ])

    expect(order).toEqual([])
    run()
    expect(order).toEqual([1, 2])
  })

  it('should run a flow in sequence when stages are promises', async () => {
    const longRunning = (duration: number = 100) =>
      new Promise((resolve) => setTimeout(resolve, duration))

    const order: Array<number> = []
    const { runAsync } = flow([
      async () => {
        await longRunning(100)
        order.push(1)
        return 1
      },
      () => {
        order.push(2)
        return 2
      },
      () => {
        return new Promise((resolve) =>
          setTimeout(() => {
            order.push(3)
            resolve(3)
          }, 100),
        )
      },
      () => {
        Promise.resolve(4)
        order.push(4)
      },
    ])

    expect(order).toEqual([])
    await runAsync()
    expect(order).toEqual([1, 2, 3, 4])
  })

  it('should stop flow when a stage rejects an error', async () => {
    const longRunning = (duration: number = 100) =>
      new Promise((resolve) => setTimeout(resolve, duration))

    const order: Array<number> = []
    const { runAsync } = flow([
      async () => {
        await longRunning()
        order.push(1)
        return 1
      },
      async () => {
        await longRunning()
        throw new Error('Fake error')
      },
      () => Promise.resolve(3),
      () => 4,
    ])

    expect(order).toEqual([])
    await runAsync()
    expect(order).toEqual([1])
  })

  it('should get results when all stages are ok', async () => {
    const { run } = flow([() => 1, () => 2])

    const results = run()
    expect(results).toEqual([
      {
        data: 1,
        name: '0',
        status: 'OK',
      },
      {
        data: 2,
        name: '1',
        status: 'OK',
      },
    ])
  })

  it('should get results when last stage throws error', () => {
    const { run } = flow([
      () => 1,
      () => {
        throw new Error('error')
      },
    ])

    const results = run()
    expect(results).toEqual([
      {
        data: 1,
        name: '0',
        status: 'OK',
      },
      {
        data: new Error('error'),
        name: '1',
        status: 'FAIL',
      },
    ])
  })

  it('should stop flow when stage throws error', async () => {
    const { run } = flow([
      () => {
        throw new Error('error')
      },
      () => 'this will not be executed',
    ])

    const results = run()
    expect(results).toEqual([
      {
        name: '0',
        data: new Error('error'),
        status: 'FAIL',
      },
    ])
  })

  it('should not stop flow when stopOnError is false', async () => {
    const { run } = flow([
      () => {
        throw new Error('error')
      },
      () => 'this will be executed normally',
    ])

    const results = run([stopOnError(false)])
    expect(results).toEqual([
      {
        name: '0',
        data: new Error('error'),
        status: 'FAIL',
      },
      {
        name: '1',
        data: 'this will be executed normally',
        status: 'OK',
      },
    ])
  })
  it('should not stop flow when stopOnError is false', async () => {
    const { runAsync } = flow([
      () => {
        return Promise.reject(new Error('error'))
      },
      () => 'this will be executed normally',
    ])

    const results = await runAsync([stopOnError(false)])
    expect(results).toEqual([
      {
        name: '0',
        data: new Error('error'),
        status: 'FAIL',
      },
      {
        name: '1',
        data: 'this will be executed normally',
        status: 'OK',
      },
    ])
  })

  it('should inject context', async () => {
    const expectedContext = {}
    const { run } = flow([
      (ctx: Context) => {
        ctx.set('alpha', 'alpha-value')
      },
      (ctx: Context) => {
        const alpha = ctx.get('alpha')
        expectedContext['alpha'] = alpha
        ctx.set('beta', 'beta-value')
      },
      (ctx: Context) => {
        const beta = ctx.get('beta')
        expectedContext['beta'] = beta
      },
    ])

    expect(expectedContext).toEqual({})
    run()
    expect(expectedContext).toEqual({
      alpha: 'alpha-value',
      beta: 'beta-value',
    })
  })
  it('should provide custom arguments', async () => {
    const alpha = vi.fn()
    const beta = vi.fn()

    const { run, provideArgs } = flow([alpha, beta])
    provideArgs((ctx) => {
      const fake = { key: 'value' }
      return [fake, ctx]
    })

    expect(alpha).not.toBeCalled()
    expect(beta).not.toBeCalled()
    run()
    expect(alpha).toBeCalledWith({ key: 'value' }, new Map())
    expect(beta).toBeCalledWith({ key: 'value' }, new Map())
  })
  it('should set context value before running', async () => {
    const alpha = vi.fn()
    const beta = vi.fn()

    const { run, context } = flow([alpha, beta])

    context.set('fake', 'fake-value')
    run()
    expect(alpha).toBeCalledWith(new Map([['fake', 'fake-value']]))
    expect(beta).toBeCalledWith(new Map([['fake', 'fake-value']]))
  })
  it('should set stages after creating it', async () => {
    const alpha = vi.fn()
    const beta = vi.fn()

    const { run, setStages } = flow()

    setStages([alpha, beta])
    expect(alpha).not.toBeCalled()
    expect(beta).not.toBeCalled()
    run()
    expect(alpha).toBeCalledWith(new Map())
    expect(beta).toBeCalledWith(new Map())
  })

  it('should set stages as array', async () => {
    const alpha = vi.fn()
    const stages = [alpha]
    const { run, runAsync } = flow(stages)
    expect(run()).toEqual([
      {
        data: undefined,
        name: '0',
        status: 'OK',
      },
    ])
    expect(runAsync()).resolves.toEqual([
      {
        data: undefined,
        name: '0',
        status: 'OK',
      },
    ])
  })
  it('should set stages as a map', () => {
    const alpha = vi.fn()
    const stages = new Map()
    stages.set('alpha', alpha)
    const { run, runAsync } = flow(stages)
    expect(run()).toEqual([
      {
        data: undefined,
        name: 'alpha',
        status: 'OK',
      },
    ])
    expect(runAsync()).resolves.toEqual([
      {
        data: undefined,
        name: 'alpha',
        status: 'OK',
      },
    ])
  })
  it('should set stages as object', () => {
    const stages = {
      alpha: vi.fn(),
    }

    const { run, runAsync } = flow(stages)
    expect(run()).toEqual([
      {
        data: undefined,
        name: 'alpha',
        status: 'OK',
      },
    ])
    expect(runAsync()).resolves.toEqual([
      {
        data: undefined,
        name: 'alpha',
        status: 'OK',
      },
    ])
  })
})
