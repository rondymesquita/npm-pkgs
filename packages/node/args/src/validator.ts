import { ModifierType, ValidatorModifier } from './modifiers'

type Handler<T, U> = (value: T, argValue: U) => boolean

export function defineValidator<T, U>(name: string, handler: Handler<T, U>) {
  return (value: T): ValidatorModifier<U> => {
    return {
      name,
      value,
      type: ModifierType.VALIDATOR,
      validate: <V extends U>(argValue: V) => handler(value, argValue),
    }
  }
}
