import { VDOM } from './vdom';

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
  vdom.attrs.watchers.forEach((value, key) => {
    value('state:update', () => {
      console.log('called here in fulano')
    })
  })
  vdom.children.forEach((child: HTMLElement | Text) =>{
    element.appendChild(child)
  })

  return element
}
