import { Component, Tag } from './models/models'

export function defineElementCreator(tag: Tag, document: typeof window.document) {
  return (...args: unknown[]): HTMLElement => {
    const element = document.createElement(tag)


    for (const index in args) {
      const arg = args[index] as any

      const instanceOfAttributes = typeof arg === 'object' && !Array.isArray(arg)
      // console.log({ arg, })
      if (typeof arg === 'string') {
        const textNode = document.createTextNode(arg)
        element.appendChild(textNode)
      } else if (arg instanceof HTMLElement) {
        element.appendChild(arg)
      } else if (instanceOfAttributes) {
        for (const key in arg) {
          const attribute = arg[key]
          const isEventListener = key.startsWith('on')
          if (isEventListener) {
            const eventName = key.split('on')[1]
            element.addEventListener(eventName, attribute)
          } else {
            element.setAttribute(key, attribute);
          }
        }

        if (arg.style) {
          Object.entries(arg.style).forEach(([key, value,]) => {
            (element.style as any)[key] = value;
          })
        }

        if (arg.watch) {
          // arg.watch.forEach((watcher: any) => {
          //   console.log(watcher, watcher.name)
          // })
        }
      } else if (typeof arg === 'function') {
        console.log(' function')
        const html = arg()
        console.log(html)
        element.appendChild(html)
      }
    }

    return element
  }
}

export function defineComponentCreator(tag: Tag, document: typeof window.document): Component {
  return (...args: unknown[]) => {

  }
}
