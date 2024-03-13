import { describe, expect, test } from 'vitest'

import { createVDOM } from '..'
import { Attrs } from '../models/models'


describe('vdom', () => {
  test('create vdom', () => {
    const attrs: Attrs<'div'> = {
      id: '1',
      onclick: () => {},
      style: {
        color: 'red',
        fontSize: '12px',
      },
      watch: [() => {},],
    }

    const vdom = createVDOM('button', [
      'text node',
      true,
      document.createElement('div'),
      () => 'text',
      attrs,
    ])
    const expectedVdom = {
      'tag': 'button',
      'attrs':  {
        events: new Map([['click', function onclick() {},],]),
        values: new Map([['id', '1',],]),
        styles: new Map([['color', 'red',], ['fontSize', '12px',],]),
        watchers: new Map([['0', () => {},],]),
      },
      'children': [
        {
          'type': 'TextNode',
          'value': 'text node',
        },
        {
          'type': 'TextNode',
          'value': true,
        },
        {
          'type': 'HTMLElement',
          'value': document.createElement('div'),
        },
        {
          'type': 'Function',
          'value': () => 'text',
        },
      ],

    }
    expect(JSON.stringify(vdom)).toEqual(JSON.stringify(expectedVdom));
  })
})
