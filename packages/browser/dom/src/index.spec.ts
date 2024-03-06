// @vitest-environment happy-dom
import { describe, expect, test } from 'vitest'

import { define } from '.'

const { createElement, } = define({ document, })

const parse = (element: HTMLElement) => {
  const attrsNames = element.getAttributeNames()
  const attributes = attrsNames.map(attrName => {
    return [attrName, element.getAttribute(attrName),]
  })
  return {
    tagName: element.tagName,
    attributes: Object.fromEntries(attributes),
    innerText: element.innerText,
    // style: getComputedStyle(element),
  }
}

describe('index', () => {
  test('create element with base function', () => {
    const element = createElement('h1', {
      title: 'titulo',
      style: {
        color: ' blue',
        fontSize: '13px',
      },
    }, 'hello world')

    document.body.appendChild(element)
    expect(document.body.outerHTML).toBe('<body><h1 title="titulo">hello world</h1></body>')
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
