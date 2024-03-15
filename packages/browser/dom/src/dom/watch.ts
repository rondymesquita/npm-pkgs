import { StateEventListener } from './state'

export type WatchHandler = () => void

export function watch(deps: StateEventListener[], watchHandler: WatchHandler){
  deps.forEach((dep:StateEventListener) => {
    dep('state:update', watchHandler)
  })
}
