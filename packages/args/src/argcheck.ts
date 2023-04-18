import { Option, ArgvOptionValue } from './'
import { Modifier } from './modifiers'

export const checkValue = (option: Option, value: ArgvOptionValue) => {
  const requiredOption = option.modifiers.find(
    (mod: Modifier) => mod.name === 'required',
  )
  const isRequired = requiredOption ? requiredOption.value : false
  const isEmpty = value === undefined || value === null

  if (isRequired && isEmpty) {
    throw new Error(`"${option.name}" is required`)
  }
}

export const checkType = (option: Option, value: ArgvOptionValue) => {
  if (typeof value != option.type) {
    throw new Error(`"${option.name}" must be of type "${option.type}"`)
  }
}
