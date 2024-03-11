export function watch<T = any>(deps: any[]
  , renderHTMLElement: () => HTMLElement): HTMLElement {
  console.log(deps)
  const wrapper = document.createElement('div')
  const handler = () => {
    console.log('called here')
    const element = renderHTMLElement()
    wrapper.replaceChildren(element)
  }
  deps.forEach(on => {
    on('fulano', handler)
  })
  const element = renderHTMLElement()
  wrapper.replaceChildren(element)
  return wrapper
}
