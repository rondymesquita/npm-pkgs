// @vitest-environment happy-dom
import { describe, test } from 'vitest'

import { createElement } from '.'


describe('index', () => {
  test('create element with createElement', () => {
    const element = createElement('h1', {
      title: 'titulo',
      style: {
        color: ' blue',
        fontSize: '13px',
      },
    }, 'hello world')

    document.body.appendChild(element)
    // expect(document.body.outerHTML).toBe('<body><h1 title="titulo">hello world</h1></body>')
    // expect(parse(element)).toBe({
    //   attributes: { title: 'titulo', },
    //   'innerText': 'hello world',
    //   'style':  {
    //     parentRule: null,
    //     color: 'blue',
    //   },
    //   'tagName': 'H1',
    // })
  })
})
