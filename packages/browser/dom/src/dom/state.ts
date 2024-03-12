import { defineEventBus, EventHandler } from '../bus';

export type State<T> = {
  value: T
}

export function useState <T>(initialValue?: T): [
  () => T,
  (v: T) => void,
  (event: string, handler: EventHandler) => void
] {
  const model = { value: initialValue, }

  const { emit, on, } = defineEventBus()

  const state: State<T> = new Proxy(model as any, {
    set: function(target: any, prop: any, value: any) {
      setTimeout(() => emit('state:update'))
      return target[prop] = value;
    },
  });

  const getValue = (): T => {
    return state.value
  }
  const setValue = (handlerOrNewValue: T): void => {
    state.value = handlerOrNewValue
  }
  return [getValue, setValue, on,]
}
