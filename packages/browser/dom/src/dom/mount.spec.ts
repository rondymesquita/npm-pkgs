// @vitest-environment happy-dom
import { describe, expect, test } from 'vitest'

import { mount } from '..'
import { NoRootElementError } from '../errors/errors';

const document = global.window.document;


describe('mount', () => {
  test('mount component into dom element', () => {
    document.body.innerHTML = '<div id="app"></div>';

    const Component = () => document.createElement('div') as unknown as HTMLElement
    const app = mount(Component, '#app')

    expect(app?.outerHTML).toEqual('<div id=\"app\"><div></div></div>')
  })
  test('throw error if dom element is not found', () => {
    document.body.innerHTML = '<div></div>';

    const Component = () => document.createElement('div') as unknown as HTMLElement
    expect(() => mount(Component, '#app')).toThrowError(new NoRootElementError('#app'))
  })
})
