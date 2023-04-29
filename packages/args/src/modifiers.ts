export enum ModifierType {
  CONFIG = 'CONFIG',
  VALIDATOR = 'VALIDATOR',
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

const createConfigModifier = <T>(name: string) => {
  return (value: T) => {
    return { name, value, type: ModifierType.CONFIG }
  }
}

export const type = (
  value: 'number' | 'string' | 'boolean',
): ConfigModifier => {
  return { name: 'type', value, type: ModifierType.CONFIG }
}
export const help = (value: string): ConfigModifier => {
  return { name: 'help', value, type: ModifierType.CONFIG }
}
export const required = (value: boolean = true): ConfigModifier => {
  return { name: 'required', value, type: ModifierType.CONFIG }
}
export const defaultValue = (value: any): ConfigModifier => {
  return { name: 'defaultvalue', value, type: ModifierType.CONFIG }
}

// export const type = createConfigModifier('type')
// export const defaultValue = createConfigModifier('defaultValue')
// export const help = createConfigModifier('help')
// export const required = createConfigModifier('required')
