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

const createTasks2 = (
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
      createTasks2(handler, tasks, name)
    }
  }

  return tasks
}

function deepFlattenObject(obj: any, namespace = '', tasks: any = {}) {
  for (let key in obj) {
    let propName: string = namespace ? namespace + ':' + key : key
    if (typeof obj[key] == 'object' && !Array.isArray(obj[key])) {
      deepFlattenObject(obj[key], propName, tasks)
    } else {
      tasks[propName] = obj[key]
    }
  }
  return tasks
}

// const createTasks = (
//   taskDef: TaskDef | Task | Task[],
//   tasks: any = {},
//   namespace: string = '',
// ) => {
//   return deepFlattenObject(taskDef)
// }

const helpMessages: { [key: string]: string } = {}

export const help = (task: Task, description: string) => {
  helpMessages[task.name] = description
}

const createHelpFunction = (namespace: string) => {
  // const name = namespace
  const help = (task: Task, description: string) => {
    const taskName = buildTaskName(namespace, task.name)
    helpMessages[taskName] = description
  }

  return help
}

function createTasksFunction(namespace: string = '') {
  const name = namespace
  const createTasks = (
    taskDef: TaskDef | Task | Task[],
    tasks: any = {},
    namespace: string = '',
  ) => {
    return deepFlattenObject(taskDef, name)
  }
  return createTasks
}

export type CreateNamespaceFn = (...params: any[]) => Promise<any> | any

export const namespace = (
  name: string,
  createNamespaceFn: CreateNamespaceFn,
): TaskDef => {
  // console.log({ name })

  const namespacedHelp = createHelpFunction(name)

  const createNamespacedTasks = createTasksFunction(name)
  return createNamespaceFn({
    help: namespacedHelp,
    tasks: createNamespacedTasks,
  })
}

export async function tasks(taskDef: TaskDef) {
  const argv = args(process.argv.slice(2))
  const name = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  const createTasks = createTasksFunction()
  const tasks = createTasks(taskDef)
  console.log(tasks)

  // const task = name ? tasks[name] : tasks.default

  // const isThereAnyNonDefaultTask =
  //   Object.keys(tasks).filter((name: string) => name !== 'default').length > 0

  // if (!name && isThereAnyNonDefaultTask) {
  //   throw new TaskNameNotInformedError()
  // }

  // if (!task) {
  //   throw new TaskNotFoundError(name)
  // }

  // if (Array.isArray(task)) {
  //   for (const step of task) {
  //     await step(ctx)
  //   }
  //   return
  // }

  // await task(ctx)
}
