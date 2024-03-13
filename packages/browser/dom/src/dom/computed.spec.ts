// @vitest-environment happy-dom
import { describe, expect, test, vi } from 'vitest'

import { computed, useState } from '..'

describe('use computed', () => {
  test('compute a value from state on created of computed', () => {
    const [state,, onState,] = useState('initial state')
    const [computedState,, onCompute,] = computed([onState,], () => {
      return state() + ' append'
    })
    const handler = vi.fn()
    onCompute('state:update', handler)
    vi.waitUntil(handler)
    expect(computedState()).toEqual('initial state append')
  })
  test('compute a value from state on state change', async() => {
    const [state, setState, onState,] = useState('initial state')
    const [computedState,, onCompute,] = computed([onState,], () => {
      return state() + ' append'
    })
    const handler = vi.fn()
    onCompute('state:update', handler)

    await new Promise(r => setTimeout(r));
    expect(computedState()).toEqual('initial state append')

    setState('new state')
    await new Promise(r => setTimeout(r));
    expect(computedState()).toBe('new state append')
  })
  test('compute a value from multiples state on state change', async() => {
    const [stateA, setStateA, onStateA,] = useState('initial state A')
    const [stateB, setStateB, onStateB,] = useState('initial state B')
    const [computedState,, onCompute,] = computed([onStateA, onStateB,], () => {
      return stateA() + ' : ' + stateB()
    })
    const handler = vi.fn()
    onCompute('state:update', handler)

    await new Promise(r => setTimeout(r));
    expect(computedState()).toEqual('initial state A : initial state B')

    setStateA('new state A')
    await new Promise(r => setTimeout(r));
    expect(computedState()).toBe('new state A : initial state B')

    setStateB('new state B')
    await new Promise(r => setTimeout(r));
    expect(computedState()).toBe('new state A : new state B')
  })
})
