import { tags } from './data/tags';
import { defineReactiveRender } from './dom/render';
import { CreateElement, CreateElementTags, Tag } from './models/models';

interface Core {
	createElement: CreateElement,
	createElementTags: CreateElementTags,
}


const createElement: CreateElement = (tag: Tag, ...args: unknown[]) => {
  const { element, } = defineReactiveRender(tag, args)
  return element
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const createElementTags: CreateElementTags = {}

tags.forEach((tag: Tag) => {
  (createElementTags as any)[tag] = (...args: unknown[]): HTMLElement => {
    const { element, } = defineReactiveRender(tag, args)
    return element
  }
})

export { createElement, createElementTags }
