import {
  defineArgs as ArgsDefineArgs,
  ArgsDefinition,
  type,
  defaultValue,
  help as helpArgs,
  ArgOptions,
  Modifier,
  ArgvOptions,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showGlobalHelp } from './help'
import { generateBasicDefinition, defineTasksFunction } from './utils'
import { flow, Context, Flow, Status } from '@rondymesquita/flow'
import { Stage } from '@rondymesquita/flow'

export * from '@rondymesquita/args'
export * from '@rondymesquita/flow'

export type Task = Stage

export interface TasksObject {
  [key: string]: Task | TasksObject | Task[]
}

export interface PlainTasksObject {
  [key: string]: Task
}

export interface TaskArgDefinition {
  options: ArgOptions
}

export type TasksDefinition = Record<
  string,
  {
    name: string
    description: string
    argsDefinition: ArgsDefinition
  }
>

export interface DefineTasks {
  getDefinition: () => TasksDefinition
  tasks: (taskDef: TasksObject) => Promise<void>
}

export const defineTasks = (defineArgs: typeof ArgsDefineArgs): DefineTasks => {
  let definition: TasksDefinition = {}

  const tasks = async (taskDef: TasksObject) => {
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
    const tasks: PlainTasksObject = createTasks(taskDef)
    const task: Task = name ? tasks[name] : tasks.default

    definition = generateBasicDefinition(tasks)

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

    let results
    let errors
    let { runAsync, context, provideArgs, setStages } = flow()
    context.set('argv', argv)
    provideArgs((ctx) => {
      return [argv.options, ctx]
    })

    if (Array.isArray(task)) {
      setStages(task)
    } else {
      setStages([task])
    }
    results = await runAsync()

    errors = results.filter((result) => result.status === Status.FAIL)
    if (errors.length > 0) {
      errors.forEach((error) => {
        console.error(error)
      })
    }
  }

  return {
    tasks,
    getDefinition: () => definition,
  }
}

const defineTasksFactory = () => {
  return defineTasks(ArgsDefineArgs)
}

const { tasks } = defineTasksFactory()
export { tasks }
