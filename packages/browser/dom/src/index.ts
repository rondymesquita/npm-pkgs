import { Tag, tags } from './models/models'


export function define({ document,  }: {
  document: typeof window.document
}){

  function defineElementCreator(tag: Tag) {
    const createElementTag = (...args: unknown[]): HTMLElement => {
      const element = document.createElement(tag)

      function processArg(arg: any) {
        if (typeof arg === 'string') {
          const textNode = document.createTextNode(arg)
          element.appendChild(textNode)
        } else if (arg instanceof HTMLElement) {
          element.appendChild(arg)
        } else if (typeof arg === 'object') {
          console.log(arg, typeof arg, arg instanceof HTMLElement)

          for (const key in arg) {
            if (key === 'style') continue
            element.setAttribute(key, arg[key]);
          }
          if (arg.style) {
            Object.entries(arg.style).forEach(([key, value,]) => {
              (element.style as any)[key] = value;
            })
          }

        }
      }

      for (const index in args) {
        processArg(args[index])
      }

      return element
    }
    return createElementTag
  }

  const createElement = (tag: Tag, ...args: unknown[]) => {
    const creator = defineElementCreator(tag);
    return creator(...args)
  }

  tags.forEach((tag: Tag) => {
    const creator = defineElementCreator(tag);
    (createElement as any)[tag] = creator
  })


  return { createElement, }
}

export const { createElement, } = define({ document, })
