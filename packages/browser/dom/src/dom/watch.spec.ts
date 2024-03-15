import { describe, expect, test, vi } from 'vitest'

import { createState, watch } from '..'

describe('watch', () => {
  test('not call watch when dependencies are empty', () => {
    const handlerMock = vi.fn();
    watch([], handlerMock)
    expect(handlerMock).toHaveBeenCalledTimes(1)
  })
  test('call watch once on creation', () => {
    const [state, setState, onState,] = createState(1)
    const handlerMock = vi.fn();
    watch([onState,], handlerMock)
    expect(handlerMock).toHaveBeenCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith()
  })
  test('call watch on state change', async() => {
    const [state, setState, onState,] = createState(1)
    const handlerMock = vi.fn();
    watch([onState,], handlerMock)
    setState(2)
    await new Promise((r) => setTimeout(r))
    expect(handlerMock).toHaveBeenCalledTimes(2)
    expect(handlerMock).toHaveBeenCalledWith()
  })
})
