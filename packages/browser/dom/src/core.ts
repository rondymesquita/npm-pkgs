import { defineReactiveRender } from './dom/render';
import { CreateElement, CreateElementTags, Tag, tags } from './models/models';

interface CoreInput {
  document: typeof window.document
}

interface Core {
	createElement: CreateElement,
	createElementTags: CreateElementTags,
}

export function defineCore({ document, }: CoreInput): Core{

  const createElement: CreateElement = (tag: Tag, ...args: unknown[]) => {
    const { element, } = defineReactiveRender(tag, args)
    return element
  }

  const createElementTags: any = {}

  tags.forEach((tag: Tag) => {
    (createElementTags as any)[tag] = (...args: unknown[]): HTMLElement => {
      const { element, } = defineReactiveRender(tag, args)
      return element
    }
  })

  return {
    createElement,
    createElementTags,
  }
}
