import { EventHandler } from '../bus'
import { Attributes, Tag } from '../models/models'
import { VDOM } from './vdom'


function render(vdom: VDOM): HTMLElement{
  const element = document.createElement(vdom.tag)
  return element
}

export function defineElementCreator(tag: Tag, document: typeof window.document) {
  return (...args: unknown[]): HTMLElement => {

    const element = document.createElement(tag)

    for (const index in args) {
      const arg = args[index] as any
      const instanceOfAttributes = typeof arg === 'object' && !Array.isArray(arg)

      if (['string', 'number', 'Date',].includes(typeof arg)) {
        const textNode = document.createTextNode(arg)
        element.appendChild(textNode)
      } else if (arg instanceof HTMLElement) {
        element.appendChild(arg)
      } else if (instanceOfAttributes) {
        const attrs: Attributes = arg

        for (const key in attrs) {
          const attribute = arg[key]
          const isEventListener = key.startsWith('on')
          if (isEventListener) {
            const eventName = key.split('on')[1]
            element.addEventListener(eventName, attribute)
          } else {
            element.setAttribute(key, attribute);
          }
        }

        if (attrs.style) {
          Object.entries(arg.style).forEach(([key, value,]) => {
            (element.style as any)[key] = value;
          })
        }

        if (attrs.watch) {
          attrs.watch.forEach((eventHandler: EventHandler) => {
            // console.log(eventHandler, eventHandler.name)
            eventHandler('state:update', () => {
              console.log('called here in fulano')
            })
          })
        }
      }
    }

    return element
  }
}
