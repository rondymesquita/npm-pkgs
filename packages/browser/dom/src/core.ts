import { Attrs, Children, Tag } from '.';
import { tags } from './data/tags';
import { render } from './dom/render';

export function createElement<K extends Tag>(tag: K, attrs: Attrs<K>, ...children: Children[]): HTMLElementTagNameMap[K]
export function createElement<K extends Tag>(tag: K, ...children: Children[]): HTMLElementTagNameMap[K]
export function createElement(tag: Tag, ...args: any[]): HTMLElement {
  const { element, } = render(tag, args)
  return element
}

export type CreateElementTags = {
  [K in Tag]: {
    (...children: Children[]): HTMLElementTagNameMap[K]
    (attrs: Attrs<K>, ...children: Children[]): HTMLElementTagNameMap[K]
  }
}
// @ts-expect-error CreateElementTags
const createElementTags: CreateElementTags = {}

tags.forEach((tag: Tag) => {
  (createElementTags as any)[tag] = (...args: any[]): HTMLElement => {
    const { element, } = render(tag, args)
    return element
  }
})

export { createElementTags }
