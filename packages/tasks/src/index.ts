import {
  Argv,
  defineArgs,
  ArgsDefinition,
  helpOption,
  Option,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showTasksHelp } from './help'
import { buildTaskName, deepFlattenTask } from './util'
export * from '@rondymesquita/args'

export interface Context {
  _: Readonly<{
    argv: Argv
  }>
  values?: Map<any, any>
}

export type Task = (ctx: Context) => Promise<any> | any | void
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
export type TaskErrorMessages = {
  [key: string]: string[]
}

export interface TaskArgDefinition {
  options: Option[]
}

const helpMessages: HelpMessages = {}

export const help = (task: Task, description: string) => {
  helpMessages[task.name] = {
    name: task.name,
    description,
    argsDefinition: { options: [] },
  }
}

export const args = (task: Task, definition: TaskArgDefinition) => {
  definition.options.push(helpOption())
  if (helpMessages[task.name]) {
    helpMessages[task.name].argsDefinition = definition
  } else {
    helpMessages[task.name] = {
      name: task.name,
      description: '',
      argsDefinition: definition,
    }
  }
}

export const createArgsFunction = (namespace: string = '') => {
  const args = (task: Task, definition: TaskArgDefinition) => {
    const name = buildTaskName(namespace, task.name)
    if (helpMessages[name]) {
      helpMessages[name].argsDefinition = definition
    } else {
      helpMessages[name] = {
        name: task.name,
        description: '',
        argsDefinition: definition,
      }
    }
  }

  return args
}

const createHelpFunction = (namespace: string) => {
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

export interface CreateNamespace {
  tasks: ReturnType<typeof createTasksFunction>
  help: ReturnType<typeof createHelpFunction>
  args: ReturnType<typeof createArgsFunction>
}

export const namespace = (
  name: string,
  createNamespaceFn: (params: CreateNamespace) => PlainTaskDefinition,
): TaskDefinition => {
  const namespacedTasks = createTasksFunction(name)
  const namespacedHelp = createHelpFunction(name)
  const namespacesArgs = createArgsFunction(name)

  const fn = createNamespaceFn({
    tasks: namespacedTasks,
    help: namespacedHelp,
    args: namespacesArgs,
  })

  return fn
}

export async function tasks(taskDef: TaskDefinition) {
  // console.log(taskDef)

  const { parseArgs, showHelp, showErrors } = defineArgs({
    name: 'tasks',
    usage: 'tasks [task name] [task options]\nUsage: tasks [options]',
    options: [helpOption()],
  })

  const argv = parseArgs(process.argv.slice(2))
  const name = argv.params[0]

  const createTasks = createTasksFunction()
  const tasks: PlainTaskDefinition = createTasks(taskDef)
  const task: Task = name ? tasks[name] : tasks.default

  // console.log(JSON.stringify(helpMessages, null, 1))
  if (argv.options.help && !task) {
    showHelp()
    showTasksHelp(helpMessages)
    return
  }

  if (argv.errors.length > 0) {
    console.log(`Errors`)
    showErrors()
    return
  }

  if (!name && !task) {
    throw new TaskNameNotInformedError()
  }

  if (name && !task) {
    throw new TaskNotFoundError(name)
  }

  if (name && helpMessages[name]) {
    const taskArgDefinition = helpMessages[name].argsDefinition

    const {
      parseArgs: parseTaskArgs,
      showHelp: showTaskHelp,
      showErrors: showTaskErrors,
    } = defineArgs(taskArgDefinition)

    parseTaskArgs(process.argv.slice(2))

    if (argv.options.help) {
      showTaskHelp()
      return
    }

    if (argv.errors.length > 0) {
      console.log(`Task errors: ${name}`)
      showTaskErrors()
      return
    }
  }

  const ctx: Context = {
    _: Object.freeze({ argv }),
    values: new Map<any, any>(),
  }

  if (Array.isArray(task)) {
    for (const step of task) {
      await step(ctx)
    }
    return
  }

  await task(ctx)
}
