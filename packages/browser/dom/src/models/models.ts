import { StateGetter } from '../dom/state'
import { EventHandler } from '../event-bus/event-bus'

// export type Tag = typeof tags[number]
// export type Tag = keyof HTMLElementTagNameMap
type HTMLElementNoStyle = Omit<HTMLElement, 'style'>
export type Attributes2<K extends keyof HTMLElementTagNameMap> = Partial<Omit<HTMLElementTagNameMap[K], 'style'>> & {
  style?: Partial<CSSStyleDeclaration>,
  watch?: Array<EventHandler>
}

export type Tag = keyof HTMLElementTagNameMap

export type Attrs<K extends Tag> = Omit<Partial<HTMLElementTagNameMap[K]>, 'style'> & {
  watch?: Array<EventHandler>,
  style?: Partial<CSSStyleDeclaration>,
}

export type Children = (() => Children) | StateGetter <any> | HTMLElement | Text | string | number | boolean
export type CreateElementTags = {
  [K in Tag]: {
    (...children: Children[]): HTMLElementTagNameMap[K]
    (attrs: Attrs<K>, ...children: Children[]): HTMLElementTagNameMap[K]
  }
}

export type CreateElement = {
  <K extends keyof HTMLElementTagNameMap>(tag: K, ...children: Children[]): HTMLElementTagNameMap[K]
  <K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs<K>, ...children: Children[]): HTMLElementTagNameMap[K]
}

export type VDOMArgs = Children | Attrs<any>

export type VDOMChildren = {
  type: 'TextNode' | 'HTMLElement' | 'Function',
  value: HTMLElement | Text |  string | number | Date | boolean | StateGetter<any>
}

export interface VDOM {
  tag: string
  attrs: {
    values: Map<string, any>
    events: Map<string, any>
    styles: Map<string, any>
    watchers: Map<string, any>
  }
  children: VDOMChildren[]
}

export type Component = (...props: unknown[]) => HTMLElement
