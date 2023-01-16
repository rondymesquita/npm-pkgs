import { string } from './types'

export interface ValidatorModifier {
  name: string
  rule: any
  validator: (rule: any, value: any) => any | Promise<any>
}

export interface ConfigModifier {
  name: string
  value: any
}

export enum ModifierType {
  CONFIG,
  VALIDATOR,
  ACTION,
}

export type Modifier = ValidatorModifier | ConfigModifier

export const constraints: { [key: string]: Function } = {
  required: (rule: boolean, value: string | number | boolean) =>
    rule && value !== null && value !== undefined,
}

// export const required = (value: boolean = true): Modifier => {
//   return { name: 'required', value }
// }
export const help = (value: string): ConfigModifier => {
  return { name: 'help', value }
}
export const defaultValue = (value: any): ConfigModifier => {
  return { name: 'defaultvalue', value }
}
export const showHelp = (): ConfigModifier => {
  return { name: 'showhelp', value: true }
}
