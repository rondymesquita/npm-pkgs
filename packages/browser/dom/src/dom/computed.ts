import { StateEventListener, useState } from './state';

export type ComputeHandler<T> = (...args: any[]) => T

export function computed<T>(deps: StateEventListener[], computeHandler: ComputeHandler<T>): ReturnType<typeof useState<T>>{
  const [state, setState, onState,] = useState<T>()
  setState(computeHandler(state()))

  deps.forEach((dep:StateEventListener) => {
    dep('state:update', (newState) => {
      setState(computeHandler(newState))
    })
  })


  return [state, setState, onState,]
}
