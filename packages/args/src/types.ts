import { NumberModifier, StringModifier } from './modifiers'

export interface OptionType {
  name: string
  type: string
  modifiers: any[]
}

export const string = (
  name: string,
  modifiers: StringModifier[] = [],
): OptionType => {
  return { name, type: 'string', modifiers }
}
export const boolean = (name: string, modifiers: any[] = []): OptionType => {
  return { name, type: 'boolean', modifiers }
}
export const number = (
  name: string,
  modifiers: NumberModifier[] = [],
): OptionType => {
  return { name, type: 'number', modifiers }
}
