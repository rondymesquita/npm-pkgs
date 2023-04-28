import {
  defineArgs,
  ArgsDefinition,
  helpOption,
  Option,
} from '@rondymesquita/args'
import { TaskNameNotInformedError, TaskNotFoundError } from './errors'
import { showGlobalHelp } from './help'
import { buildTaskName, deepFlattenTask } from './util'
import { flow, Context, Flow, Status } from '@rondymesquita/flow'

export * from '@rondymesquita/args'
export { Context } from '@rondymesquita/flow'

export type Task = (ctx: Context) => Promise<any> | any
export interface TaskDefinition {
  [key: string]: Task | TaskDefinition | Task[]
}

export interface PlainTaskDefinition {
  [key: string]: Task
}

export interface TaskArgDefinition {
  options: Option[]
}

// export interface Definition {
//   name: string
//   description: string
//   argsDefinition: ArgsDefinition
// }

export type Definition = {
  [key: string]: {
    name: string
    description: string
    argsDefinition: ArgsDefinition
  }
}

// const createHelpFunction = (namespace: string) => {
//   const help = (task: Task, description: string) => {
//     const name = buildTaskName(namespace, task.name)

//     definition[name] = {
//       name,
//       description,
//       argsDefinition: { options: [] },
//     }
//   }

//   return help
// }

function createTasksFunction(namespace: string = '') {
  const name = namespace

  const createTasks = (
    taskDef: TaskDefinition | Task | Task[],
  ): PlainTaskDefinition => {
    return deepFlattenTask(taskDef, name)
  }
  return createTasks
}

interface CreateNamespace {
  tasks: ReturnType<typeof createTasksFunction>
  // help: ReturnType<typeof createHelpFunction>
  args: (task: Task, taskArgDefinition: TaskArgDefinition) => void
}

export interface DefineTasks {
  definition: Definition
  args: (task: Task, definition: TaskArgDefinition) => void
  tasks: (taskDef: TaskDefinition) => Promise<void>
  namespace: (
    name: string,
    defineNamespaceTasks: (params: CreateNamespace) => PlainTaskDefinition,
  ) => TaskDefinition
}

export const defineTasks = (): DefineTasks => {
  const definition: Definition = {}

  const fillEmptyDefinition = (tasks: PlainTaskDefinition) => {
    Object.entries(tasks).forEach(([name, task]) => {
      if (!definition[name]) {
        definition[name] = {
          name,
          description: '',
          argsDefinition: {
            options: [helpOption()],
          },
        }
      }
    })
  }

  const createArgsFunction = (namespace: string = '') => {
    const args = (task: Task, taskArgDefinition: TaskArgDefinition) => {
      taskArgDefinition.options.push(helpOption())
      const name = buildTaskName(namespace, task.name)
      if (definition[name]) {
        definition[name].argsDefinition = taskArgDefinition
      } else {
        definition[name] = {
          name: task.name,
          description: '',
          argsDefinition: taskArgDefinition,
        }
      }
    }

    return args
  }

  const args = createArgsFunction()

  const namespace = (
    name: string,
    defineNamespaceTasks: (params: CreateNamespace) => PlainTaskDefinition,
  ): TaskDefinition => {
    const namespacedTasks = createTasksFunction(name)
    // const namespacedHelp = createHelpFunction(name)
    const namespacedArgs = createArgsFunction(name)

    const fn = defineNamespaceTasks({
      tasks: namespacedTasks,
      // help: namespacedHelp,
      args: namespacedArgs,
    })

    return fn
  }

  async function tasks(taskDef: TaskDefinition) {
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
    fillEmptyDefinition(tasks)

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
    namespace,
    definition,
  }
}

const { namespace, definition, tasks, args } = defineTasks()
export { namespace, definition, tasks, args }
