import { string } from './types'

export interface Modifier {
  name: string
  value: any
}

export const constraints: { [key: string]: Function } = {
  required: (rule: boolean, value: string | number | boolean) =>
    rule && value !== null && value !== undefined,
}

export const required = (value: boolean = true): Modifier => {
  return { name: 'required', value }
}
export const help = (value: string): Modifier => {
  return { name: 'help', value }
}
export const defaultValue = (value: any): Modifier => {
  return { name: 'default', value }
}
export const showHelp = (): Modifier => {
  return { name: 'showhelp', value: true }
}
