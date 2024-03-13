import { EventHandler } from '../bus'
import { StateGetter } from '../dom/state'

export const tags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'search',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
] as const

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

export type Children = (() => Children) | HTMLElement | Text | string | number | boolean | Date
// Partial<HTMLElementTagNameMap[K]
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
