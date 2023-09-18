
export const prepareCommand = (cmd: string | Array<string> | TemplateStringsArray,): string | string[] => {
  let finalCmd: string | Array<string>
  if (typeof cmd === 'object') {
    finalCmd = cmd[0]
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c)
  } else {
    finalCmd = cmd.trim()
  }

  return finalCmd
}

export type ExportedClassMembers<T, C = any> = {
  [k in keyof T]: C
}

export const exportClassMembers = <T>(
  instance: any,
  filteredPropeties: string[] = [],
): T => {
  const properties = Reflect.ownKeys(Object.getPrototypeOf(instance)).filter((p) => {
    const prop = p as string
    return prop !== 'constructor' && !filteredPropeties.includes(prop)
  },)

  const members: any = {}
  properties.forEach((prop) => {
    members[prop] = instance[prop].bind(instance)
  })
  return members
}
export function exportClassMembersDeep<T>(obj: any,
  depth: number = Infinity,
  filter: string[] = [],): any {
  // const methods = new Set()
  const members: any = {}

  const methods = new Set()
  while (depth-- && obj) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      methods.add(key)
    }
    obj = Object.getOwnPropertyNames(obj)
  }
  return { ...methods }
}

export const copy = (object: any) => {
  const copied: any = {}

  if (typeof object !== 'object') {
    return object
  }

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const element = object[key]
      if (Array.isArray(element)) {
        const copiedArr = []
        for (let index = 0; index < element.length; index++) {
          const el = element[index]
          copiedArr.push(copy(el))
        }
        copied[key] = copiedArr
      } else if (typeof element === 'object') {
        copied[key] = copy(element)
      } else {
        copied[key] = element
      }
    }
  }
  return copied
}

export const merge = <T = any>(left: any, right: any): T => {
  const merged: any = copy(left)
  for (const key in right) {
    if (Object.prototype.hasOwnProperty.call(right, key)) {
      const newValue = copy(right[key])
      if (!merged[key]) {
        merged[key] = newValue
      }
    }
  }
  return merged
}
