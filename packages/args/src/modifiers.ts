export enum ModifierType {
  CONFIG = 'CONFIG',
  VALIDATOR = 'VALIDATOR',
  ACTION = 'ACTION',
}

export interface Modifier {
  name: string
  type: ModifierType
  value: any
}

export type Validator<U> = (argValue: U) => boolean | Promise<boolean>
export type Action = (params: any) => any | Promise<any>

export interface ValidatorModifier<U> extends Modifier {
  type: ModifierType.VALIDATOR
  validate: Validator<U>
}

export interface ConfigModifier extends Modifier {
  type: ModifierType.CONFIG
}

export interface ActionModifier extends Modifier {
  type: ModifierType.ACTION
  action: Action
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
