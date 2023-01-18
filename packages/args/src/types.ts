import { Modifier } from './modifiers'

export interface Option {
  name: string
  type: string
  modifiers: Modifier[]
}

export const string = (name: string, modifiers: Modifier[] = []): Option => {
  return { name, type: 'string', modifiers }
}
export const boolean = (name: string, modifiers: Modifier[] = []): Option => {
  return { name, type: 'boolean', modifiers }
}
export const number = (name: string, modifiers: Modifier[] = []): Option => {
  return { name, type: 'number', modifiers }
}
