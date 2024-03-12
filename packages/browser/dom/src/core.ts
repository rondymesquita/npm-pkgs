import { render } from './dom/render';
import { createVDOM } from './dom/vdom';
import { CreateElement, CreateElementObject, Tag, tags } from './models/models';

interface CoreInput {
  document: typeof window.document
}

interface Core {
	createElement: CreateElement,
	createElementTags: CreateElementObject,
}

export function defineCore({ document, }: CoreInput): Core{

  const createElement: any = (tag: Tag, ...args: unknown[]) => {
    // const creator = defineElementCreator(tag, document);
    // return creator(...args)
  }

  const createElementTags: any = {}

  tags.forEach((tag: Tag) => {
    createElementTags[tag] = (...args: unknown[]): HTMLElement => {
      let vdom = createVDOM(tag, args)
      let element: HTMLElement = render(document, vdom)
      vdom.attrs.watchers.forEach((value, key) => {
        if(tag === 'h1') {
          console.log({ vdom, })
        }
        value('state:update', () => {
          const rerenderVdom = createVDOM(tag, args)
          const rerenderElement = render(document, vdom)
          element.replaceWith(rerenderElement)
          element = rerenderElement
          vdom = rerenderVdom
          console.log('called here in fulano', element.innerHTML)
        })
      })

      return element
    }
  })

  return {
    createElement,
    createElementTags,
  }
}
