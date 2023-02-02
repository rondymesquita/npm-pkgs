import { flow, stopOnError } from './index'

describe('flow', () => {
  it('should run a flow in sequence', () => {
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
    run()
    expect(order).toEqual([1, 2])
  })

  it('should get results when all stages are ok', () => {
    const run = flow([() => 1, () => 2])

    const results = run()
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

  it('should get results when laste stage throws error', () => {
    const run = flow([
      () => 1,
      () => {
        throw new Error('error')
      },
    ])

    const results = run()
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

  it('should stop flow when stage throws error', () => {
    const run = flow([
      () => {
        throw new Error('error')
      },
      () => 'this will not be executed',
    ])

    const results = run()
    expect(results).toEqual([
      {
        data: 'error',
        status: 'FAIL',
      },
    ])
  })

  it('should not stop flow when stopOnError is false', () => {
    const run = flow([
      () => {
        throw new Error('error')
      },
      () => 'this will be executed normally',
    ])

    const results = run([stopOnError(false)])
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

  it('should run a flow in sequence when stages are promises', () => {
    const longRunning = () => new Promise((resolve) => setTimeout(resolve, 100))

    const order: Array<number> = []
    const run = flow([
      async () => {
        order.push(1)
        await longRunning()
        return 1
      },
      async () => {
        order.push(2)
        await longRunning()
        return 2
      },
    ])

    expect(order).toEqual([])
    run()
    expect(order).toEqual([1, 2])
  })
})
