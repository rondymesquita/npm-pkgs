import {
  defineArgs,
  ArgsDefinition,
  type,
  defaultValue,
  help as helpArgs,
  Options,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showGlobalHelp } from './help'
import { buildTaskName, generateBasicDefinition } from './util'
import { flow, Context, Flow, Status } from '@rondymesquita/flow'
import { defineArgsFunction, defineTasksFunction } from './functions'

export { Context } from '@rondymesquita/flow'

export type Task = (ctx: Context) => Promise<any> | any
export interface TasksDefinition {
  [key: string]: Task | TasksDefinition | Task[]
}

export interface PlainTasksDefinition {
  [key: string]: Task
}

export interface TaskArgDefinition {
  options: Options
}

export interface TaskMeta {
  name: string
  description: string
  argsDefinition: ArgsDefinition
}
export type TaskDefinition = Record<string, TaskMeta>

interface CreateNamespace {
  tasks: ReturnType<typeof defineTasksFunction>
  // help: ReturnType<typeof createHelpFunction>
  // args: (task: Task, taskArgDefinition: TaskArgDefinition) => void
}

export interface DefineTasks {
  definition: TaskDefinition
  args: (task: Task, definition: TaskArgDefinition) => void
  tasks: (taskDef: TasksDefinition) => Promise<void>
  help: (task: Task, description: string) => void
  namespace: (
    name: string,
    defineNamespaceTasks: (params: CreateNamespace) => PlainTasksDefinition,
  ) => TasksDefinition
}

export const defineTasks = (): DefineTasks => {
  let definition: TaskDefinition = {}

  const { args, setCallback } = defineArgsFunction()
  setCallback((d: TaskDefinition) => {
    definition = { ...definition, ...d }
  })

  const createHelpFunction = (namespace: string = '') => {
    const help = (task: Task, description: string) => {
      const name = buildTaskName(namespace, task.name)

      if (definition[name]) {
        // definition[name].argsDefinition = {
        //   options: [...definition[name].argsDefinition.options, helpOption()],
        // }
      } else {
        // definition[name] = {
        //   name: task.name,
        //   description: '',
        //   argsDefinition: {
        //     // options: [helpOption('help', description)],
        //     name: '',
        //     usage: '',
        //   },
        // }
      }
      // definition[name] = {
      //   name,
      //   description,
      //   argsDefinition: { options: [] },
      // }
    }

    return help
  }

  const help = createHelpFunction()

  const namespace = (
    name: string,
    defineNamespaceTasks: (params: CreateNamespace) => PlainTasksDefinition,
  ): TasksDefinition => {
    const tasks = defineTasksFunction(name)
    // const { args } = defineArgsFunction(name)

    const fn = defineNamespaceTasks({
      tasks,
    })

    return fn
  }

  const tasks = async (taskDef: TasksDefinition) => {
    const { parseArgs, showHelp, showErrors } = defineArgs({
      name: 'tasks',
      usage: 'tasks [task name] [task options]\nUsage: tasks [options]',
      options: {
        help: [
          helpArgs('Show help message'),
          type('boolean'),
          defaultValue(false),
        ],
      },
    })

    const argv = parseArgs(process.argv.slice(2))

    const name = argv.params[0]

    const createTasks = defineTasksFunction()
    const tasks: PlainTasksDefinition = createTasks(taskDef)
    const task: Task = name ? tasks[name] : tasks.default
    definition = generateBasicDefinition(tasks, definition)

    if (argv.options.help && !name) {
      showHelp()
      showGlobalHelp(definition)
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

    if (name && definition[name]) {
      const taskArgDefinition = definition[name].argsDefinition

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

    let { runAsync, context }: Partial<Flow> = {}
    let results
    let errors
    if (Array.isArray(task)) {
      ;({ runAsync, context } = flow(task))
      context.set('argv', argv)
      results = await runAsync()
    } else {
      ;({ runAsync, context } = flow([task]))
      context.set('argv', argv)
      results = await runAsync()
    }

    errors = results.filter((result) => result.status === Status.FAIL)
    if (errors.length > 0) {
      errors.forEach((error) => {
        console.error(error.data)
      })
    }
  }

  return {
    tasks,
    args,
    help,
    namespace,
    definition,
  }
}

const { namespace, tasks } = defineTasks()
export { namespace, tasks }
