import { parseArgs, Argv } from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { buildTaskName, deepFlattenTask } from './util'

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

  const createTasks = (taskDef: TaskDef | Task | Task[]) => {
    return deepFlattenTask(taskDef, name)
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
  const argv = parseArgs(process.argv.slice(2))
  const name = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  const createTasks = createTasksFunction()
  const tasks = createTasks(taskDef)
  console.log(tasks)

  if (argv.options.help) {
    console.log(helpMessages)
    return
  }

  const task = name ? tasks[name] : tasks.default

  console.log({ tasks })

  const isThereAnyNonDefaultTask =
    Object.keys(tasks).filter((name: string) => name === 'default').length > 0

  console.log({ tasks, isThereAnyNonDefaultTask })
  if (!name && !isThereAnyNonDefaultTask) {
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
