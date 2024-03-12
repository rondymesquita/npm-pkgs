import { Attributes, Tag } from '../models/models'

export type VDOMChildren = {
  type: 'TextNode' | 'HTMLElement' | 'Function',
  value: HTMLElement | Text |  string | number | Date | boolean | (() => any)
}
export interface VDOM {
  tag: string
  attrs: {
    values: Map<string, any>
    events: Map<string, any>
    styles: Map<string, any>
    watchers: Map<string, any>
  }
  // children: (HTMLElement | Text)[]
  children: VDOMChildren[]
}

export function createVDOM(tag: Tag, args: unknown[]): VDOM {
  const vdom: VDOM = {
    tag,
    attrs: {
      events: new Map(),
      values: new Map(),
      styles: new Map(),
      watchers: new Map(),
    },
    children: [],
  }
  for (const index in args) {
    const arg = args[index] as any
    if ([
      'string', 'number', 'Date', 'boolean',
    ].includes(typeof arg)) {
      vdom.children.push({
        type: 'TextNode',
        value: arg,
      })
      // const textNode = document.createTextNode(arg)
      // vdom.children.push(textNode)
    } else if (arg instanceof HTMLElement) {
      vdom.children.push({
        type: 'HTMLElement',
        value: arg,
      })
      // vdom.children.push(arg)
    }else if (typeof arg === 'function'){
      vdom.children.push({
        type: 'Function',
        value: arg,
      })
      // vdom.children.push(arg)
      // console.log({
      //   index,
      //   arg,
      //   instance: arg,
      // })
    } else if (typeof arg === 'object' && !Array.isArray(arg)) {
      const attrs: Attributes = arg

      for (const key in attrs) {
        const attribute = arg[key]
        console.log({
          attribute,
          key,
        })
        const isEventListener = key.startsWith('on')
        const isStyle = key === 'style'
        const isWatch = key === 'watch'
        if (isEventListener) {
          const eventName = key.split('on')[1]
          vdom.attrs.events.set(eventName, attribute)
        } else if (isStyle) {
          Object.entries(arg.style).forEach(([key, value,]) => {
            vdom.attrs.styles.set(key, value);
          })
        } else if (isWatch) {
          Object.entries(arg.watch).forEach(([key, eventHandler,]: any) => {
            vdom.attrs.watchers.set(key, eventHandler);
            // eventHandler('state:update', () => {
            //   console.log('called here in fulano')
            // })
          })
        } else {
          vdom.attrs.values.set(key, attribute);
        }
      }
    }
  }
  return vdom
}
