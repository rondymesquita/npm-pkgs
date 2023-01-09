import { args, Argv } from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'

export { Options } from '@rondymesquita/args'
export interface TaskContext {
  argv: Argv
}
export type Task = (ctx: TaskContext) => Promise<any> | any
export interface TaskDef {
  [key: string]: Task | TaskDef | Task[]
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
  taskDef: TaskDef | Task | Task[],
  tasks: any = {},
  namespace: string = '',
): PlainTaskDef => {
  for (const key in taskDef) {
    const handler = (taskDef as any)[key]
    let name = buildTaskName(namespace, key)

    if (typeof handler === 'function' || Array.isArray(handler)) {
      tasks[name] = handler
    } else {
      createTasks(handler, tasks, name)
    }
  }

  return tasks
}

export const tasks = async (taskDef: TaskDef) => {
  const argv = args(process.argv.slice(2))
  const name = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  const tasks = createTasks(taskDef)
  // console.log('>>>> tasks', tasks)

  const task = name ? tasks[name] : tasks.default

  const isThereAnyNonDefaultTask =
    Object.keys(tasks).filter((name: string) => name !== 'default').length > 0

  if (!name && isThereAnyNonDefaultTask) {
    throw new TaskNameNotInformedError()
  }

  if (!task) {
    throw new TaskNotFoundError(name)
  }

  if (Array.isArray(task)) {
    for (const step of task) {
      await step(ctx)
    }
    return
  }

  await task(ctx)
}
