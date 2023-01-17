import { Context } from '@rondymesquita/flow'
import { OptionValue } from '.'
import { Modifier } from './modifiers'
import { OptionType } from './types'

export const checkValue = (option: OptionType, value: OptionValue) => {
  const requiredOption = option.modifiers.find(
    (mod: Modifier) => mod.name === 'required',
  )
  const isRequired = requiredOption ? requiredOption.value : false
  const isEmpty = value === undefined || value === null

  if (isRequired && isEmpty) {
    throw new Error(`"${option.name}" is required`)
  }
}

export const checkType = (option: OptionType, value: OptionValue) => {
  if (typeof value != option.type) {
    throw new Error(`"${option.name}" must be of type "${option.type}"`)
  }
}
