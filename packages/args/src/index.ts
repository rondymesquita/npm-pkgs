import { printErrors } from './errors'
import {
  Modifier,
  ValidatorModifier,
  ConfigModifier,
  ModifierType,
} from './modifiers'
import { parseValue } from './utils'
import { printHelp } from './help'
import { flow, Result, Status } from '@rondymesquita/flow'
import { checkType, checkValidator, checkValue } from './argcheck'
import { Options } from './options'

export * from './modifiers'
export * from './options'
export * from './validator'
export * from './help'

export type ArgvOptionValue = string | number | boolean | undefined | null
export type ArgvOptions = Record<string, ArgvOptionValue>
export interface Argv {
  options: ArgvOptions
  params: Array<string>
  errors: string[]
}

export interface ArgsDefinition {
  name?: string
  usage?: string
  options: Options
}

export interface DefineArgs {
  parseArgs: (args: string[]) => Argv
  showHelp: () => any
  showErrors: () => any
}

export const defineArgs = (definition: ArgsDefinition): DefineArgs => {
  let errors: string[] = []

  const showHelp = () => {
    printHelp(definition)
  }

  const showErrors = () => {
    printErrors(errors)
  }

  const parseArgsWithDefinition = (args: string[]): Argv => {
    const argv = parseArgs(args)

    /**Fill default values */
    Object.entries(definition.options).forEach(([name, modifiers]) => {
      const value = argv.options[name]
      argv.options = fillOptionsDefaultValues(name, modifiers, value, argv)
    })

    Object.entries(definition.options).forEach(([name, modifiers]) => {
      const value = argv.options[name]

      const modifierFunctions = modifiers
        .filter((modifier: Modifier) => {
          return modifier.type === ModifierType.VALIDATOR
        })
        .map((modifier: Modifier) => {
          return () => checkValidator(name, modifier, value)
        })

      const results = flow([
        () => checkValue(name, modifiers, value),
        () => checkType(name, modifiers, value),
        ...modifierFunctions,
      ]).run()

      const resultErrors = results
        .filter((result: Result) => result.status === Status.FAIL)
        .map((result: Result) => (result.data as Error).message)

      errors = errors.concat(resultErrors)

      // TODO, if verbose enabled
      // if (errors.length > 0) {
      //   console.log(errors)
      //   return
      // }
    })

    argv.errors = errors
    return argv
  }

  return { parseArgs: parseArgsWithDefinition, showHelp, showErrors }
}

export const parseArgs = (args: string[]): Argv => {
  const options: ArgvOptions = {}
  const params: Array<string> = []
  const SINGLE_DASH_REGEX = /^-(\w*)(=(.*))?$/
  const DOUBLE_DASH_REGEX = /^--(\w*)(=(.*))?$/

  args.map((arg: string) => {
    const regex = [SINGLE_DASH_REGEX, DOUBLE_DASH_REGEX].find((regex) => {
      return !!arg.match(regex)
    })

    const regexResult = arg.match(regex!)

    if (regexResult![0]) {
      const key = regexResult![1]
      const value = regexResult![3]
      options[key] = parseValue(value)
      return
    }

    params.push(arg)
  })

  return { options, params, errors: [] }
}

const fillOptionsDefaultValues = (
  // option: Option,
  // value: any,
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
