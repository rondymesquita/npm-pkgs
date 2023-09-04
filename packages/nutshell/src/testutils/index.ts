import { Constructable, Mock, vi } from 'vitest'
import { DeepPartial } from '../models'
import { merge } from '../utils'

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

      return target[prop]
    },
  })
}

type ClassParams<T extends Constructable> = {
  [k in keyof Partial<ConstructorParameters<T>[0]>]: {
    [j: string]: Mock<any, any>
  }
}

export const createSutClass = <T extends Constructable>(
  clazz: Constructable,
  params: ClassParams<T>,
) => {
  const DEFAULT_MOCKS = {
    childProcess: vi.fn(),
    process: vi.fn(),
    fs: vi.fn(),
    options: {},
  }
  const finalParams = merge(params, DEFAULT_MOCKS)
  console.log(finalParams)

  return new clazz(finalParams)
}

// type Params = Partial<ConstructorParameters<typeof ShellComponent>[0]>

// type ParamMock = {
//   [k in keyof Params]: {
//     [j: string]: Mock<any, any>
//   }
// }

// const createSut = <T extends Constructable>(
//   params: {
//     [k in keyof Partial<ConstructorParameters<T>[0]>]: {
//       [j: string]: Mock<any, any>
//     }
//   },
// ) => {
//   class Sut extends ShellComponent {
//     constructor() {
//       super(params as any)
//     }
//   }

//   return new Sut()
// }

// const createTestingClass = (clazz: Constructable) => {
//   type Params<T extends Constructable> = {
//     [k in keyof Partial<ConstructorParameters<T>[0]>]: {
//       [j: string]: Mock<any, any>
//     }
//   }
//   const createSut = <T extends Constructable>(
//     params: Params<T>,
//   ): InstanceType<T> => {
//     class Sut extends clazz {
//       constructor() {
//         super(params as any)
//       }
//     }

//     return new Sut() as InstanceType<T>
//   }

//   return {
//     createSut,
//   }
// }
