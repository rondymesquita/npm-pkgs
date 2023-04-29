import { defaultValue, help, Modifier } from './modifiers'
// export interface Option {
//   name: string
//   type: string
//   modifiers: Modifier[]
// }

export interface Option {
  name: string
  type: string
}

// const createTypeOptionFn = (type: string) => {
//   return (name: string, modifiers: Modifier[] = []) => {
//     return { name, type, modifiers }
//   }
// }

// export const string = createTypeOptionFn('string')
// export const boolean = createTypeOptionFn('boolean')
// export const number = createTypeOptionFn('number')

// export const helpOption = (name = 'help', message = 'Show help message') => {
//   return boolean(name, [help(message), defaultValue(false)])
// }
