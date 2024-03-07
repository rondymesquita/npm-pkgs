import { Tag } from './models/models'

export function defineElementCreator(tag: Tag, document: typeof window.document) {
  return (...args: unknown[]): HTMLElement => {
    const element = document.createElement(tag)


    for (const index in args) {
      const arg = args[index] as any
      if (typeof arg === 'string') {
        const textNode = document.createTextNode(arg)
        element.appendChild(textNode)
      } else if (arg instanceof HTMLElement) {
        element.appendChild(arg)
      } else if (typeof arg === 'object') {

        for (const key in arg) {
          const argValue = arg[key]
          const isEventListener = key.startsWith('on')
          if (isEventListener) {
            const eventName = key.split('on')[1]
            element.addEventListener(eventName, argValue)
          } else {
            element.setAttribute(key, argValue);
          }
        }
        if (arg.style) {
          Object.entries(arg.style).forEach(([key, value,]) => {
            (element.style as any)[key] = value;
          })
        }
      }
    }

    return element
  }
}
