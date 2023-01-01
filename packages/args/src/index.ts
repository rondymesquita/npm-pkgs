export type Options = Record<string, any>
export interface Argv {
  options: Options
  params: Array<string>
}

const isBoolean = (value: string) => {
  return ['true', 'false'].includes(value)
}

const parseValue = (value: any) => {
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

const SINGLE_DASH_REGEX = /^-(\w*)(=(.*))?$/
const DOUBLE_DASH_REGEX = /^--(\w*)(=(.*))?$/

export const args = (args: string[]): Argv => {
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
