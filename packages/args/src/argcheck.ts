import { Option, ArgvOptionValue } from './'
import { Modifier, ModifierType, ValidatorModifier } from './modifiers'

export const checkValue = (
  name: string,
  modifiers: Modifier[],
  value: ArgvOptionValue,
) => {
  // console.log(modifiers)

  const requiredOption = modifiers.find(
    (mod: Modifier) => mod.name === 'required',
  )
  const isRequired = requiredOption ? requiredOption.value : false
  const isEmpty = value === undefined || value === null
  if (isRequired && isEmpty) {
    throw new Error(`"${name}" is required`)
  }
}

export const checkValidator = (
  name: string,
  modifier: Modifier,
  value: ArgvOptionValue,
) => {
  if (!(modifier as ValidatorModifier<any>).validate(value)) {
    throw new Error(
      `"${name}" must satisfy "${modifier.name}" constraint. Expected:"${modifier.value}". Received:"${value}".`,
    )
  }
}

export const checkType = (
  name: string,
  modifiers: Modifier[],
  value: ArgvOptionValue,
) => {
  const typeOption = modifiers.find((mod: Modifier) => mod.name === 'type')

  if (!typeOption) {
    return
  }

  if (typeof value != typeOption.value) {
    throw new Error(`"${name}" must be of type "${typeOption.value}"`)
  }
}
