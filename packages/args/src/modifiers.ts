import { string } from './types'

export enum ModifierType {
  CONFIG,
  VALIDATOR,
}

export interface Modifier {
  name: string
  type: ModifierType
  value: any
}

export type Validator = (rule: any, value: any) => any | Promise<any>

export interface ValidatorModifier extends Modifier {
  type: ModifierType.VALIDATOR
  validator: Validator
}

export interface ConfigModifier extends Modifier {
  type: ModifierType.CONFIG
}

export const required = (value: boolean = true): ConfigModifier => {
  return { name: 'required', value, type: ModifierType.CONFIG }
}
export const help = (value: string): ConfigModifier => {
  return { name: 'help', value, type: ModifierType.CONFIG }
}
export const defaultValue = (value: any): ConfigModifier => {
  return { name: 'defaultvalue', value, type: ModifierType.CONFIG }
}
export const showHelp = (): ConfigModifier => {
  return { name: 'showhelp', value: true, type: ModifierType.CONFIG }
}
