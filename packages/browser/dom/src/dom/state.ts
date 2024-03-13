import { defineEventBus, EventHandler } from '../event-bus/event-bus';

export type State<T> = {
  value: T
}

export type StateGetter<T> = () => T
export type StateSetter<T> = (v: T) => void
export type StateEvent = 'state:update'
export type StateEventListener = (event: StateEvent, handler: EventHandler) => void

export function useState <T>(initialValue?: T): [
  StateGetter<T>,
  StateSetter<T>,
  StateEventListener
] {
  const model = { value: initialValue, }

  const { emit, on, } = defineEventBus<StateEvent>()

  const state: State<T> = new Proxy(model as any, {
    set: function(target: any, prop: any, value: any) {
      setTimeout(() => emit('state:update', value))
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
