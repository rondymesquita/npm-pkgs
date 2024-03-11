import { Attributes, Tag } from '../models/models'

export interface VDOM {
  tag: string
  attrs: {
    values: Map<string, any>
    events: Map<string, any>
    styles: Map<string, any>
    watchers: Map<string, any>
  }
  children: (HTMLElement | Text)[]
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
      const textNode = document.createTextNode(arg)
      vdom.children.push(textNode)
    } else if (arg instanceof HTMLElement) {
      vdom.children.push(arg)
    } else if (typeof arg === 'object' && !Array.isArray(arg)) {
      const attrs: Attributes = arg

      for (const key in attrs) {
        const attribute = arg[key]
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
