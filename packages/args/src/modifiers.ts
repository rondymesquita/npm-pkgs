type Keys = 'max' | 'required'
// export interface NumberModifier {
//   max: number
//   min: number
// }

export interface Modifier<T> {
  name: string
  value: T
}

export type AnyModifier = ReturnType<typeof required> | ReturnType<typeof help>

export type StringModifier = AnyModifier | ReturnType<typeof length>
export type NumberModifier =
  | AnyModifier
  | ReturnType<typeof max>
  | ReturnType<typeof min>

export const validators: { [key: string]: Function } = {
  required: (rule: boolean, value: string | number | boolean) =>
    rule ? rule && value !== null && value !== undefined : true,
  max: (rule: number, value: number) => value <= rule,
  min: (rule: number, value: number) => value >= rule,
}

/**
 *
 */
export const required = (value: boolean = true): Modifier<boolean> => {
  return { name: 'required', value }
}
export const help = (value: string) => {
  return { name: 'help', value }
}
export const defaultValue = (value: any) => {
  return { name: 'default', value }
}
/**
 *
 */

export const length = (value: number): Modifier<number> => {
  return { name: 'length', value }
}
export const max = (value: number): Modifier<number> => {
  return { name: 'max', value }
}
export const min = (value: number): Modifier<number> => {
  return { name: 'min', value }
}
