import { defaultValue, help, type } from '@rondymesquita/args'
import { TasksObject, PlainTasksObject, Task, TasksDefinition } from '.'

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

export function defineTasksFunction(namespace: string = '') {
  const name = namespace

  const createTasks = (
    taskDef: TasksObject | Task | Task[],
  ): PlainTasksObject => {
    return deepFlattenTask(taskDef, name)
  }
  return createTasks
}

export const generateBasicDefinition = (tasks: PlainTasksObject) => {
  let definition: TasksDefinition = {}

  for (const name in tasks) {
    if (Object.prototype.hasOwnProperty.call(tasks, name)) {
      definition[name] = {
        name,
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
  }
  return definition
}
