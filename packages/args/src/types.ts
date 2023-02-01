import { Modifier } from './modifiers'

export interface Option {
  name: string
  type: string
  modifiers: Modifier[]
}

const createTypeOption = (type: string) => {
  return (name: string, modifiers: Modifier[] = []) => {
    return { name, type, modifiers }
  }
}

export const string = createTypeOption('string')
export const boolean = createTypeOption('boolean')
export const number = createTypeOption('number')
