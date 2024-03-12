import { defineReactiveRender } from './dom/render';
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
      const { element, } = defineReactiveRender(tag, args)
      return element
    }
  })

  return {
    createElement,
    createElementTags,
  }
}
