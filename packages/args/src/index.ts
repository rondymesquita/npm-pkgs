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
import { checkType, checkValue } from './argcheck'
import { Option } from './options'

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
  options: Option[]
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
    for (let index = 0; index < definition.options.length; index++) {
      const option = definition.options[index]
      const value = argv.options[option.name]
      argv.options = fillOptionsDefaultValues(option, argv, value)
    }

    /**Validate */
    for (let index = 0; index < definition.options.length; index++) {
      const option = definition.options[index]
      const value = argv.options[option.name]

      const results = flow([
        () => checkValue(option, value),
        () => checkType(option, value),
      ]).run()

      const optionErrors = results
        .filter((result: Result) => result.status === Status.FAIL)
        .map((result: Result) => result.data)

      errors = errors.concat(optionErrors)

      const validators = option.modifiers.filter(
        (mod: Modifier) => mod.type === ModifierType.VALIDATOR,
      )
      validators.forEach((modifier: Modifier) => {
        if (!(modifier as ValidatorModifier<any>).validate(value)) {
          errors.push(
            `"${option.name}" must satisfy "${modifier.name}" constraint. Expected:"${modifier.value}". Received:"${value}".`,
          )
        }
      })
    }
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
  option: Option,
  argv: Argv,
  value: any,
): ArgvOptions => {
  const cloneArgOptions: ArgvOptions = { ...argv.options }

  if (value) {
    return cloneArgOptions
  }

  if (!argv.options[option.name]) {
    const defaultModifier: ConfigModifier | undefined = option.modifiers.find(
      (mod: Modifier) => mod.name === 'defaultvalue',
    ) as ConfigModifier

    if (defaultModifier) {
      cloneArgOptions[option.name] = defaultModifier.value
    }
  }

  return cloneArgOptions
}
