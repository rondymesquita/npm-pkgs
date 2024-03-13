import { describe, expect, test, vi } from 'vitest'

import { useState } from '..'

describe('use state', () => {
  test('set initial state value', () => {
    const [state,] = useState('initial state')
    expect(state()).toEqual('initial state')
  })
  test('set and get value', () => {
    const [state, setState,] = useState('initial state')
    expect(state()).toEqual('initial state')
    setState('new state')
    expect(state()).toEqual('new state')
  })
  test('listen to state change using event listener', () => {
    const [, setState, onState,] = useState('initial state')
    const handlerMock = vi.fn()
    onState('state:update', handlerMock)
    expect(handlerMock).not.toBeCalled()
    setState('new state')
    vi.waitUntil(handlerMock)
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toBeCalledWith()
  })
})
