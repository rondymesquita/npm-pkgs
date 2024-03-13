import { EventHandler } from '../bus'
import { Attrs, Tag, VDOM, VDOMChildren } from '../models/models'
import { StateGetter } from './state'

export function defineReactiveRender(tag: Tag, args: unknown[]) {
  let vdom = createVDOM(tag, args)
  let element: HTMLElement = render(vdom)

  vdom.attrs.watchers.forEach((value: EventHandler) => {
    value('state:update', () => {
      const rerenderVdom = createVDOM(tag, args)
      const rerenderElement = render(vdom)
      element.replaceWith(rerenderElement)
      element = rerenderElement
      vdom = rerenderVdom
    })
  })

  return { element, }
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

export function render(vdom: VDOM): HTMLElement{
  const element = document.createElement(vdom.tag)

  vdom.attrs.values.forEach((value, key) => {
    element.setAttribute(key, value)
  })
  vdom.attrs.events.forEach((value, key) => {
    element.addEventListener(key, value)
  })
  vdom.attrs.styles.forEach((value, key) => {
    (element.style as any)[key] = value;
  })
  vdom.children.forEach((child: VDOMChildren) =>{
    let childElement: Node;
    if (child.type === 'TextNode') {
      childElement = document.createTextNode(`${child.value}`)
    } else if (child.type === 'HTMLElement') {
      childElement = child.value as Node
    } else {
      childElement = document.createTextNode(`${(child.value as StateGetter<any>)()}`)
    }
    element.appendChild(childElement)
  })

  return element

}
