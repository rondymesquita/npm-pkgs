import { Result } from './types'

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

export const processResultPromise = async (result: Result): Promise<Result> => {
  let { data, status } = result
  if (data instanceof Promise) {
    try {
      data = await data
    } catch (err) {
      data = err
    }
  }
  return { data, status }
}
