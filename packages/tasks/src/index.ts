import {
  parseArgs,
  Argv,
  defineArgs,
  ArgsDefinition,
  helpOption,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { printGlobalHelp, printTaskHelp } from './help'
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
  definition.options.push(helpOption('help', 'Show task help message'))
  helpMessages[task.name].argsDefinition = definition
  defineArgs(definition)
}

export const createArgsFunction = (namespace: string = '') => {
  const args = (task: Task, definition: ArgsDefinition) => {
    const name = buildTaskName(namespace, task.name)
    definition.options.push(helpOption('help', 'Show task help message'))
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
    // helpMessages[taskName] = description
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
  const parseArgs = defineArgs({
    name: 'tasks',
    usage: (name) => `${name} [task name] [options]`,
    options: [helpOption()],
  })

  const argv = parseArgs(process.argv.slice(2))
  const name = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  const createTasks = createTasksFunction()
  const tasks = createTasks(taskDef)
  const task = name ? tasks[name] : tasks.default

  if (argv.options.test) {
    if (name) {
      printTaskHelp(task, name, helpMessages)
    } else {
      // printGlobalHelp(tasks, helpMessages)
    }
    // console.log(helpMessages)
    return
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
