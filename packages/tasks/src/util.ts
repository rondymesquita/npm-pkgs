export const buildTaskName = (namespace: string, fnName: string) => {
  let name: string = namespace ? `${namespace}:${fnName}` : fnName

  if (name !== 'default' && name.includes('default')) {
    name = name.replace(':default', '')
  }

  return name
}

export function deepFlattenTask(obj: any, namespace = '', result: any = {}) {
  for (let key in obj) {
    // let propName: string = namespace ? namespace + ':' + key : key
    const propName = buildTaskName(namespace, key)
    if (typeof obj[key] == 'object' && !Array.isArray(obj[key])) {
      deepFlattenTask(obj[key], propName, result)
    } else {
      result[propName] = obj[key]
    }
  }
  return result
}
