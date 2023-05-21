import {
  defineArgs as ArgsDefineArgs,
  ArgsDefinition,
  type,
  defaultValue,
  help as helpArgs,
  Options,
  Modifier,
  ArgvOptions,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showGlobalHelp } from './help'
import { asyncLoop, buildTaskName, generateBasicDefinition } from './util'
import { flow, Context, Flow, Status } from '@rondymesquita/flow'
import { defineTasksFunction } from './functions'

export { Context } from '@rondymesquita/flow'

export type Task = (options: ArgvOptions, ctx: Context) => Promise<any> | any

export interface Definition {
  [key: string]: Task | Definition | Task[]
}

export interface PlainDefinition {
  [key: string]: Task
}

export interface TaskArgDefinition {
  options: Options
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
  // definition: TasksDefinition
  getDefinition: () => TasksDefinition
  tasks: (taskDef: Definition) => Promise<void>
}
const createTasksDefinition = (namespace: string) => {
  let definition: TasksDefinition = {}

  const setArgsDefinition = (
    taskName: string,
    taskArgDefinition: TaskArgDefinition,
  ) => {
    const name = buildTaskName(namespace, taskName)

    if (definition[name]) {
      definition[name].argsDefinition = taskArgDefinition
    } else {
      definition[name] = {
        name: name,
        description: '',
        argsDefinition: taskArgDefinition,
      }
    }
  }

  const setModifiers = (
    taskName: string,
    optionName: string,
    modifiers: Modifier[],
  ) => {
    definition[taskName].argsDefinition.options[optionName] = modifiers
  }
  const addModifiers = (
    taskName: string,
    optionName: string,
    modifiers: Modifier[],
  ) => {
    definition[taskName].argsDefinition.options[optionName] = [
      ...definition[taskName].argsDefinition.options[optionName],
      ...modifiers,
    ]
  }
  return {
    getDefinition: () => definition,
    setDefinition: (_definition: TasksDefinition) => (definition = _definition),
    mergeDefinition: (_definition: TasksDefinition) =>
      (definition = {
        ...definition,
        ..._definition,
      }),
    setArgsDefinition,
    setModifiers,
    addModifiers,
  }
}

export const defineTasks = (defineArgs: typeof ArgsDefineArgs): DefineTasks => {
  const {
    getDefinition,
    setDefinition,
    setArgsDefinition,
    setModifiers,
    addModifiers,
    mergeDefinition,
  } = createTasksDefinition('')

  const tasks = async (taskDef: Definition) => {
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
    const tasks: PlainDefinition = createTasks(taskDef)
    const task: Task = name ? tasks[name] : tasks.default

    const basicDefinition = generateBasicDefinition(getDefinition())
    mergeDefinition(basicDefinition)

    if (argv.options.help && !name) {
      showHelp()
      showGlobalHelp(getDefinition())
      return
    }

    console.log(argv)

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

    if (name && getDefinition()[name]) {
      const taskArgDefinition = getDefinition()[name].argsDefinition

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
    getDefinition,
  }
}

const defineTasksFactory = () => {
  return defineTasks(ArgsDefineArgs)
}

const { tasks } = defineTasksFactory()
export { tasks }
