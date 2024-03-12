import { EventHandler } from '../bus'

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

export type Tag = typeof tags[number]
type HTMLElementNoStyle = Omit<HTMLElement, 'style'>
export type Attributes = {
  [P in keyof HTMLElementNoStyle]?: HTMLElementNoStyle[P];
} & {
  style?: Partial<CSSStyleDeclaration>,
  watch?: Array<EventHandler>
}

export type Children = (() => Children) | HTMLElement | Text | string | number | boolean | Date
export type CreateElementInTag = {
  (...children: Children[]): HTMLElement
  (attrs: Attributes, ...children: Children[]): HTMLElement
};
export type CreateElementObject = {
  [key in Tag]: CreateElementInTag
}

export type CreateElement = {
  (tag: Tag, ...children: Children[]): HTMLElement
  (tag: Tag, attrs: Attributes, ...children: Children[]): HTMLElement
}

export type Component = {
  (...props: unknown[]): HTMLElement
}
