import {
  defineArgs as ArgsDefineArgs,
  ArgsDefinition,
  type,
  defaultValue,
  help as helpArgs,
  Options,
  Modifier,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showGlobalHelp } from './help'
import { buildTaskName, generateBasicDefinition } from './util'
import { flow, Context, Flow, Status } from '@rondymesquita/flow'
import { defineTasksFunction } from './functions'

export { Context } from '@rondymesquita/flow'

export type Task = (ctx: Context) => Promise<any> | any
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
  definition: TasksDefinition
  args: (task: Task, definition: TaskArgDefinition) => void
  tasks: (taskDef: Definition) => Promise<void>
  help: (task: Task, description: string) => void
  namespace: (
    name: string,
    defineNamespaceTasks: (params: CreateNamespace) => PlainDefinition,
  ) => Definition
}

interface CreateNamespace {
  tasks: ReturnType<typeof defineTasksFunction>
  args: (task: Task, taskArgDefinition: TaskArgDefinition) => void
}

const createTaskDefinition = () => {
  let definition: TasksDefinition = {}

  const setArgsDefinition = (
    taskName: string,
    taskArgDefinition: TaskArgDefinition,
  ) => {
    if (definition[taskName]) {
      definition[taskName].argsDefinition = taskArgDefinition
    } else {
      definition[taskName] = {
        name: taskName,
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
    setArgsDefinition,
    setModifiers,
    addModifiers,
  }
}

export const defineTasks = (defineArgs: typeof ArgsDefineArgs): DefineTasks => {
  let {
    getDefinition,
    setDefinition,
    setArgsDefinition,
    setModifiers,
    addModifiers,
  } = createTaskDefinition()

  const args = (task: Task, taskArgDefinition: TaskArgDefinition) => {
    const name = buildTaskName('', task.name)
    setArgsDefinition(name, taskArgDefinition)
    setModifiers(name, 'help', [
      helpArgs('Show help message'),
      type('boolean'),
      defaultValue(false),
    ])
  }

  const help = (task: Task, description: string) => {
    const name = buildTaskName('', task.name)

    if (getDefinition()[name]) {
      addModifiers(name, 'help', [
        helpArgs('Show help message'),
        type('boolean'),
        defaultValue(false),
      ])
    } else {
      setModifiers(name, 'help', [
        helpArgs('Show help message'),
        type('boolean'),
        defaultValue(false),
      ])
    }
  }

  const namespace = (
    name: string,
    defineNamespaceTasks: (params: CreateNamespace) => PlainDefinition,
  ): Definition => {
    const tasks = defineTasksFunction(name)
    // const { args } = defineArgsFunction(name)
    const args = ((namespace: string) => {
      return (task: Task, taskArgDefinition: TaskArgDefinition) => {
        const name = buildTaskName(namespace, task.name)
        setArgsDefinition(name, taskArgDefinition)
        setModifiers(name, 'help', [
          helpArgs('Show help message'),
          type('boolean'),
          defaultValue(false),
        ])
      }
    })(name)

    const fn = defineNamespaceTasks({
      tasks,
      args,
    })

    return fn
  }

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
    const basicDefinition = generateBasicDefinition(tasks, getDefinition())
    setDefinition(basicDefinition)

    if (argv.options.help && !name) {
      showHelp()
      showGlobalHelp(getDefinition())
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
    definition: getDefinition(),
  }
}

const defineTasksFactory = () => {
  return defineTasks(ArgsDefineArgs)
}

const { tasks } = defineTasksFactory()
export { tasks }
