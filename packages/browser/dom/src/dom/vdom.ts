import { Attrs, Tag, VDOM, VDOMArgs } from '../models/models'


export function createVDOM(tag: Tag, args: VDOMArgs[]): VDOM {
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
    if (['string', 'number', 'boolean',].includes(typeof arg)) {
      vdom.children.push({
        type: 'TextNode',
        value: arg,
      })
    } else if (arg instanceof HTMLElement) {
      vdom.children.push({
        type: 'HTMLElement',
        value: arg,
      })
    }else if (typeof arg === 'function'){
      vdom.children.push({
        type: 'Function',
        value: arg,
      })
    } else if (typeof arg === 'object' && !Array.isArray(arg)) {
      const attrs: Attrs<any> = arg

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
          })
        } else {
          vdom.attrs.values.set(key, attribute);
        }
      }
    } else {
      console.log({ arg, })
    }
  }
  return vdom
}
