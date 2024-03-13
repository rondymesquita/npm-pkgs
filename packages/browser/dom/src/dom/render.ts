import { EventHandler } from '../event-bus/event-bus'
import { Tag, VDOM, VDOMChildren } from '../models/models'
import { StateGetter } from './state'
import { createVDOM } from './vdom'

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
