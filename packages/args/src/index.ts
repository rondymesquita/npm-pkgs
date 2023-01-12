import { printErrors } from './errors'
import { Modifier, validators } from './modifiers'
import { parseValue } from './utils'
import { OptionType } from './types'
import { showHelp } from './help'

export * from './modifiers'
export * from './types'
export * from './command'
export * from './help'

export type Options = Record<string, any>
export interface Argv {
  options: Options
  params: Array<string>
}

export interface ArgsDefinition {
  options: OptionType[]
}

const SINGLE_DASH_REGEX = /^-(\w*)(=(.*))?$/
const DOUBLE_DASH_REGEX = /^--(\w*)(=(.*))?$/

const errors: string[] = []

export const param = (...params: any[]) => {}

export const helpArgs = () => {}
export const showErrors = () => {
  printErrors(errors)
}

export const defineArgs = (definition: ArgsDefinition) => {
  showHelp(definition)
  // const def = definition
  const args = (args: string[]): Argv => {
    const argv = parseArgs(args)
    definition.options.forEach((option: any) => {
      const value = argv.options[option.name]
      // console.log({ option, value }, typeof value)
      if (typeof value != option.type) {
        errors.push(`'${option.name}' must be of type '${option.type}'`)
        // throw new Error('type error')
      }

      option.modifiers.forEach((modifier: any) => {
        const { name: modifierName, value: modifierValue } = modifier
        // const modifierValue = modifier[name]

        const modifierValidator = validators[modifierName]
        if (modifierValidator && !modifierValidator(modifierValue, value)) {
          // console.log(validate, value)
          // throw new Error('errors')
        }
      })
    })

    if (errors.length > 0) {
      showErrors()
    }

    return argv as Argv
  }
  return args
}

export const parseArgs = (args: string[]): Argv => {
  const options: Options = {}
  const params: Array<string> = []

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

  return { options, params }
}
