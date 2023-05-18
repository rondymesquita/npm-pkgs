import { defaultValue, help, type } from '@rondymesquita/args'
import { PlainDefinition, TasksDefinition } from '.'

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

export const generateBasicDefinition = (
  tasks: PlainDefinition,
  definition: TasksDefinition,
) => {
  const clonedDefinition = JSON.parse(
    JSON.stringify(definition),
  ) as TasksDefinition

  Object.entries(tasks).forEach(([taskName, task]) => {
    if (!clonedDefinition[taskName]) {
      clonedDefinition[taskName] = {
        name: taskName,
        description: '',
        argsDefinition: {
          options: {
            help: [
              help('Show help message'),
              type('boolean'),
              defaultValue(false),
            ],
          },
        },
      }
    }
  })

  return clonedDefinition
}

export const defineCallback = <T extends any>(): [
  (...data: T[]) => void,
  (c: Function) => void,
] => {
  let callback: Function = () => {}

  const setCallback = (_callback: Function) => {
    callback = _callback
  }

  const invokeCallback = (...data: T[]) => {
    callback(...data)
  }

  return [invokeCallback, setCallback]
}
