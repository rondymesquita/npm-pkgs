import { vi } from 'vitest'
import { DeepPartial } from '../models'

export const fillMocks2 = (object: DeepPartial<any>) => {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (Array.isArray(object[key])) {
        for (const el of object[key]) {
          fillMocks(el)
        }
      } else if (typeof object[key] === 'object') {
        fillMocks(object[key])
      } else {
        object[key] = vi.fn()
      }
    }
  }
}
export const fillMocks = (object: DeepPartial<any>) => {
  return new Proxy(object, {
    get(target, prop, receiver) {
      if (!target[prop]) {
        target[prop] = vi.fn()
      }
      // console.log({ target })

      return target[prop]
    },
  })
}
