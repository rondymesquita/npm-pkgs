import { VDOM, VDOMChildren } from './vdom';

// export function rerender(doc: typeof document, vdom: VDOM, element: HTMLElement): HTMLElement {
//   const rerenderElement = render(document, vdom)
//   element.replaceWith(rerenderElement)
// }

export function render(doc: typeof document, vdom: VDOM): HTMLElement{
  const element = doc.createElement(vdom.tag)

  vdom.attrs.values.forEach((value, key) => {
    element.setAttribute(key, value)
  })
  vdom.attrs.events.forEach((value, key) => {
    element.addEventListener(key, value)
  })
  vdom.attrs.styles.forEach((value, key) => {
    (element.style as any)[key] = value;
  })
  // vdom.attrs.watchers.forEach((value, key) => {
  //   value('state:update', () => {
  //     render(doc, vdom)
  //     console.log('called here in fulano')
  //   })
  // })
  vdom.children.forEach((child: VDOMChildren) =>{
    let childElement: Node;
    if (child.type === 'TextNode') {
      childElement = doc.createTextNode(`${child.value}`)
    } else if (child.type === 'HTMLElement') {
      childElement = child.value as Node
    } else {
      childElement = doc.createTextNode(`${(child.value as any)()}`)
    }
    element.appendChild(childElement)
  })

  return element

}
