import { args, Argv } from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'

export { Options } from '@rondymesquita/args'
export interface TaskContext {
  argv: Argv
}
export type Task = (ctx: TaskContext) => void
export interface TaskDef {
  [key: string]: Task | TaskDef
}

export interface PlainTaskDef {
  [key: string]: Task
}

const buildTaskName = (namespace: string, fnName: string) => {
  let name: string = namespace ? `${namespace}:${fnName}` : fnName

  if (name !== 'default' && name.includes('default')) {
    name = name.replace(':default', '')
  }

  return name
}

const createTasks = (
  taskDef: TaskDef,
  tasks: any = {},
  namespace: string = '',
): PlainTaskDef => {
  Object.entries(taskDef).forEach((def: any) => {
    const fnName = def[0]
    let name = buildTaskName(namespace, fnName)

    const fnOrNamespaceDef = def[1]
    if (typeof fnOrNamespaceDef === 'function') {
      tasks[name] = fnOrNamespaceDef
      return
    }

    createTasks(fnOrNamespaceDef, tasks, name)
  })

  return tasks
}

export const tasks = async (taskDef: TaskDef) => {
  const argv = args(process.argv.slice(2))
  const name = argv.params[0]

  console.log(argv)

  const ctx: TaskContext = {
    argv,
  }

  const tasks = createTasks(taskDef)

  let task: Task
  if (name) {
    task = tasks[name]
  } else {
    task = tasks.default
  }

  console.log({ name, task, t: Object.keys(tasks) })

  const isThereAnyNonDefaultTask =
    Object.keys(tasks).filter((name: string) => name !== 'default').length > 0

  if (!name && isThereAnyNonDefaultTask) {
    throw new TaskNameNotInformedError()
  }

  if (!task) {
    throw new TaskNotFoundError(name)
  }

  await task(ctx)
}
