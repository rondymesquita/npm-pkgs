import { defaultValue, help, type } from '@rondymesquita/args'
import { buildTaskName, deepFlattenTask, defineCallback } from './util'
import {
  PlainDefinition,
  Task,
  TaskArgDefinition,
  TasksDefinition,
  Definition,
} from '.'

export function defineTasksFunction(namespace: string = '') {
  const name = namespace

  const createTasks = (
    taskDef: Definition | Task | Task[],
  ): PlainDefinition => {
    return deepFlattenTask(taskDef, name)
  }
  return createTasks
}
