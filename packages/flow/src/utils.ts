import { Result, Status } from './types'

export const createObjectFromArray = <T extends object>(array: Array<T>): T => {
  let optionsObject = {}
  array.forEach((option: T) => {
    optionsObject = {
      ...optionsObject,
      ...option,
    }
  })

  return optionsObject as T
}
