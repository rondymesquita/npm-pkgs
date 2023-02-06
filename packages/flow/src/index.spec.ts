import { flow, stopOnError } from './index'

describe('flow', () => {
  it('should run a flow in sequence', async () => {
    const order: Array<number> = []
    const run = flow([
      () => {
        order.push(1)
      },
      () => {
        order.push(2)
      },
    ])

    expect(order).toEqual([])
    await run()
    expect(order).toEqual([1, 2])
  })

  it('should get results when all stages are ok', async () => {
    const run = flow([() => 1, () => 2])

    const results = await run()
    expect(results).toEqual([
      {
        data: 1,
        status: 'OK',
      },
      {
        data: 2,
        status: 'OK',
      },
    ])
  })

  it('should get results when laste stage throws error', async () => {
    const run = flow([
      () => 1,
      () => {
        throw new Error('error')
      },
    ])

    const results = await run()
    expect(results).toEqual([
      {
        data: 1,
        status: 'OK',
      },
      {
        data: 'error',
        status: 'FAIL',
      },
    ])
  })

  it('should stop flow when stage throws error', async () => {
    const run = flow([
      () => {
        throw new Error('error')
      },
      () => 'this will not be executed',
    ])

    const results = await run()
    expect(results).toEqual([
      {
        data: 'error',
        status: 'FAIL',
      },
    ])
  })

  it('should not stop flow when stopOnError is false', async () => {
    const run = flow([
      () => {
        throw new Error('error')
      },
      () => 'this will be executed normally',
    ])

    const results = await run([stopOnError(false)])
    expect(results).toEqual([
      {
        data: 'error',
        status: 'FAIL',
      },
      {
        data: 'this will be executed normally',
        status: 'OK',
      },
    ])
  })

  it('should run a flow in sequence when stages are promises', async () => {
    const longRunning = (duration: number = 100) =>
      new Promise((resolve) => setTimeout(resolve, duration))

    const order: Array<number> = []
    const run = flow([
      async () => {
        await longRunning(1000)
        order.push(1)
        return 1
      },
      async () => {
        await longRunning(100)
        order.push(2)
        return 2
      },
    ])

    expect(order).toEqual([])
    await run()
    expect(order).toEqual([1, 2])
  })
})
