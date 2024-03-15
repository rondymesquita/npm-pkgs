import { describe, expect, test, vi } from 'vitest'

import { render, useState } from '..'
import { defineEventBus } from '../event-bus/event-bus'

describe('render', () => {
  test('render element', () => {
    const h1 = document.createElement('h1')
    h1.innerText = 'heading'
    const rendered = render('div', [
      {
        className: 'class',
        id: '1',
      },
      h1,
    ])
    expect(rendered).toMatchInlineSnapshot(`
      {
        "element": <div
          classname="class"
          id="1"
        >
          <h1>
            heading
          </h1>
        </div>,
      }
    `)
  })
  test('trigger state change on first render', () => {
    const { emit, on, } = defineEventBus()
    const onEmitStateChange = vi.fn(() => emit)
    const onStateChange = vi.fn(() => on)
    const rendered = render('div', [
      {
        className: 'class',
        id: '1',
        watch: [onStateChange,],
      },
    ])
    expect(onEmitStateChange).toBeCalledTimes(0)
    expect(onStateChange).toBeCalledTimes(1)
  })
  test('rerender element when event bus emit a state update', async() => {
    const { emit, on, } = defineEventBus()
    const onEmitStateChange = vi.fn(() => emit('state:update'))
    const onStateChange = vi.fn()
    on('state:update', onStateChange)
    const attrs = {
      className: 'class',
      id: '1',
      watch: [onStateChange,],
    }
    const rendered = render('div', [attrs,])
    expect(onEmitStateChange).toBeCalledTimes(0)
    expect(onStateChange).toBeCalledTimes(1)

    expect(rendered).toMatchInlineSnapshot(`
    {
      "element": <div
        classname="class"
        id="1"
      />,
    }
  `)

    onEmitStateChange()
    await new Promise((r) => setTimeout(r))
    expect(onStateChange).toBeCalledTimes(2)

    expect(rendered).toMatchInlineSnapshot(`
    {
      "element": <div
        classname="class"
        id="1"
      />,
    }
  `)

  })
  test('rerender element when state changes', async() => {
    const [state, setState, onState,] = useState('initial state')
    const attrs = {
      className: 'class',
      id: 'element',
      watch: [onState,],
    }
    // eslint-disable-next-line prefer-const
    let { element, } = render('div', [attrs, state,])
    document.body.appendChild(element)
    const handlerMock = vi.fn()
    onState('state:update', handlerMock)
    vi.waitUntil(handlerMock)
    expect(handlerMock).toBeCalledTimes(1)

    expect(element).toMatchInlineSnapshot(`
      <div
        classname="class"
        id="element"
      >
        initial state
      </div>
    `)


    setState('new state')

    await vi.waitUntil(
      () => {
        element = document.querySelector('#element')!
        return element?.textContent === 'new state'
      }
    )

    vi.waitUntil(handlerMock)
    expect(handlerMock).toBeCalledTimes(4)
    expect(handlerMock).toBeCalledWith()
    expect(element).toMatchInlineSnapshot(`
    <div
      classname="class"
      id="element"
    >
      new state
    </div>
  `)
  })
})
