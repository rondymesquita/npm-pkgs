import { StateGetter } from '..'
import { Attrs } from './attrs.model'
import { Tag } from './tag.model'

export type Children = (() => Children) | StateGetter <any> | HTMLElement | Text | string | number | boolean

export type CreateElement = {
  <K extends keyof HTMLElementTagNameMap>(tag: K, ...children: Children[]): HTMLElementTagNameMap[K]
  <K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs<K>, ...children: Children[]): HTMLElementTagNameMap[K]
}

export type CreateElementTags = {
  [K in Tag]: {
    (...children: Children[]): HTMLElementTagNameMap[K]
    (attrs: Attrs<K>, ...children: Children[]): HTMLElementTagNameMap[K]
  }
}
