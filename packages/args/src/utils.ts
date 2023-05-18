import { Argv, ArgvOptionValue, ArgvOptions } from '.'
import { ConfigModifier, Modifier } from './modifiers'

export const isBoolean = (value: string) => {
  return ['true', 'false'].includes(value)
}

export const parseValue = (value: any) => {
  if (isBoolean(value)) {
    return value === 'true'
  } else if (!value) {
    return true
  } else if (value === '0') {
    return 0
  } else {
    return Number(value) || value
  }
}

export const fillOptionsDefaultValues = (
  name: string,
  modifiers: Modifier[],
  value: ArgvOptionValue,
  argv: Argv,
): ArgvOptions => {
  const cloneArgOptions: ArgvOptions = { ...argv.options }

  if (value) {
    return cloneArgOptions
  }

  if (!argv.options[name]) {
    const defaultModifier: ConfigModifier | undefined = modifiers.find(
      (mod: Modifier) => mod.name === 'defaultvalue',
    ) as ConfigModifier

    if (defaultModifier) {
      cloneArgOptions[name] = defaultModifier.value
    }
  }

  return cloneArgOptions
}
