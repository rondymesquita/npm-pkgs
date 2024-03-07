import { defineElementCreator } from './element-creator';
import { CreateElement, CreateElementObject, Tag, tags } from './models/models';

interface CoreInput {
  document: typeof window.document
}

interface Core {
	createElement: CreateElement,
	createElementTags: CreateElementObject,
}

export function defineCore({ document, }: CoreInput): Core{

  const createElement: CreateElement = (tag: Tag, ...args: unknown[]) => {
    const creator = defineElementCreator(tag, document);
    return creator(...args)
  }

  const createElementTags: any = {}

  tags.forEach((tag: Tag) => {
    const creator = defineElementCreator(tag, document);
    createElementTags[tag] = creator
  })

  return {
    createElement,
    createElementTags,
  }
}
