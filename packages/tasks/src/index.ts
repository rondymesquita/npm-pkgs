import {
  Argv,
  defineArgs,
  ArgsDefinition,
  helpOption,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showTaskHelp, showGlobalHelp } from './help'
import { buildTaskName, deepFlattenTask } from './util'

export { Options } from '@rondymesquita/args'
export interface TaskContext {
  argv: Argv
}
export type Task = (ctx: TaskContext) => Promise<any> | any
export interface TaskDefinition {
  [key: string]: Task | TaskDefinition | Task[]
}

export interface PlainTaskDefinition {
  [key: string]: Task
}

export interface HelpMessage {
  name: string
  description: string
  argsDefinition: ArgsDefinition
}

export type HelpMessages = {
  [key: string]: HelpMessage
}

const helpMessages: HelpMessages = {}

export const help = (task: Task, description: string) => {
  helpMessages[task.name] = {
    name: task.name,
    description,
    argsDefinition: { options: [] },
  }
}

export const args = (task: Task, definition: ArgsDefinition) => {
  definition.options.push(helpOption())
  helpMessages[task.name].argsDefinition = definition
  defineArgs(definition)
}

export const createArgsFunction = (namespace: string = '') => {
  const args = (task: Task, definition: ArgsDefinition) => {
    const name = buildTaskName(namespace, task.name)
    definition.options.push(helpOption())
    helpMessages[name].argsDefinition = definition
    defineArgs(definition)
  }

  return args
}

const createHelpFunction = (namespace: string) => {
  // const name = namespace
  const help = (task: Task, description: string) => {
    const name = buildTaskName(namespace, task.name)
    helpMessages[name] = {
      name,
      description,
      argsDefinition: { options: [] },
    }
  }

  return help
}

function createTasksFunction(namespace: string = '') {
  const name = namespace

  const createTasks = (
    taskDef: TaskDefinition | Task | Task[],
  ): PlainTaskDefinition => {
    return deepFlattenTask(taskDef, name)
  }
  return createTasks
}

export type CreateNamespaceFn = (...params: any[]) => Promise<any> | any

export const namespace = (
  name: string,
  createNamespaceFn: CreateNamespaceFn,
): TaskDefinition => {
  const namespacedHelp = createHelpFunction(name)
  const namespacedTasks = createTasksFunction(name)
  const namespacesArgs = createArgsFunction(name)
  return createNamespaceFn({
    help: namespacedHelp,
    tasks: namespacedTasks,
    args: namespacesArgs,
  })
}

export async function tasks(taskDef: TaskDefinition) {
  const { parseArgs, showHelp, showErrors } = defineArgs({
    name: 'tasks',
    usage: 'tasks [task name] [task options]\nUsage: tasks [options]',
    options: [helpOption()],
  })

  const argv = parseArgs(process.argv.slice(2))
  const name = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  const createTasks = createTasksFunction()
  const tasks: PlainTaskDefinition = createTasks(taskDef)
  const task: Task = name ? tasks[name] : tasks.default

  if (argv.options.help) {
    if (name) {
      showTaskHelp(task, name, helpMessages)
    } else {
      showHelp()
      showGlobalHelp(tasks, helpMessages)
    }
    return
  }

  if (argv.errors.length > 0) {
    showErrors()
  }

  const isThereAnyNonDefaultTask =
    Object.keys(tasks).filter((name: string) => name === 'default').length > 0

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
