import { defaultValue, help, type } from '@rondymesquita/args'
import { buildTaskName, deepFlattenTask, defineCallback } from './util'
import {
  PlainTasksDefinition,
  Task,
  TaskArgDefinition,
  TaskDefinition,
  TasksDefinition,
} from '.'

export function defineTasksFunction(namespace: string = '') {
  const name = namespace

  const createTasks = (
    taskDef: TasksDefinition | Task | Task[],
  ): PlainTasksDefinition => {
    return deepFlattenTask(taskDef, name)
  }
  return createTasks
}

export const defineArgsFunction = (namespace: string = '') => {
  const [invokeCallback, setCallback] = defineCallback()
  const definition: TaskDefinition = {}

  const args = (task: Task, taskArgDefinition: TaskArgDefinition) => {
    taskArgDefinition.options['help'] = [
      help('Show help message'),
      type('boolean'),
      defaultValue(false),
    ]
    const name = buildTaskName(namespace, task.name)
    if (definition[name]) {
      definition[name].argsDefinition = taskArgDefinition
    } else {
      definition[name] = {
        name: task.name,
        description: '',
        argsDefinition: taskArgDefinition,
      }
    }

    invokeCallback(definition)
  }

  return { args, setCallback }
}
