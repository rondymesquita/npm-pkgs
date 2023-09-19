import { Options } from '../models'
import { merge } from '../utils'

export const DEFAULT_OPTIONS: Options = {
  shell: 'bash',
  loggerLevel: 'info',
}

const options = merge<Options>({}, DEFAULT_OPTIONS)

export const useGlobalOptions = () => {
  const setOptions = (_options: Partial<Options>) => {
    Object.assign(options, _options)
  }
  return {
    options,
    setOptions,
  }
}
