import { StateEventListener } from './state'

export type WatchHandler = () => void

export function watch(deps: StateEventListener[], watchHandler: WatchHandler){
  deps.forEach((dep:StateEventListener) => {
    dep('state:update', watchHandler)
  })
}

function watchDeprecated<T = any>(deps: any[]
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
