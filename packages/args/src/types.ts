import { Modifier } from './modifiers'

export interface Option {
  name: string
  type: string
  modifiers: Modifier[]
}

const createTypeOptionFn = (type: string) => {
  return (name: string, modifiers: Modifier[] = []) => {
    return { name, type, modifiers }
  }
}

export const string = createTypeOptionFn('string')
export const boolean = createTypeOptionFn('boolean')
export const number = createTypeOptionFn('number')
