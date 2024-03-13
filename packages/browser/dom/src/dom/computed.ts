import { StateEventListener, useState } from './state';

export type ComputeHandler<T> = () => T

export function computed<T>(deps: StateEventListener[], computeHandler: ComputeHandler<T>): ReturnType<typeof useState<T>>{
  const [state, setState, onState,] = useState<T>()
  let countOfOccurrences = 0

  deps.forEach((dep:StateEventListener) => {
    dep('state:update', () => {
      countOfOccurrences += 1;
      setTimeout(() => setState(computeHandler()))
    })
  })

  // onState('state:update', () => console.log('here'))

  return [state, setState, onState,]
}
