import { Option } from './types'

export const stopOnError = (value = true): Option => {
  return { stopOnError: value }
}
