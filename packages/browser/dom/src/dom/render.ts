import { EventHandler } from '../event-bus/event-bus'
import { Attrs, Children, Tag } from '../models/models'
import { createVDOM, renderVDOM } from './vdom'

export type Render = {
  element: HTMLElement
}
export type RenderArgs = Attrs<any> | Children
export function render(tag: Tag, args: RenderArgs[]): Render {
  let vdom = createVDOM(tag, args)
  let element: HTMLElement = renderVDOM(vdom)

  vdom.attrs.watchers.forEach((watch: EventHandler) => {
    watch('state:update', () => {
      const rerenderVdom = createVDOM(tag, args)
      const rerenderElement = renderVDOM(vdom)
      element.replaceWith(rerenderElement)
      element = rerenderElement
      vdom = rerenderVdom
    })
  })

  return { element, }
}
