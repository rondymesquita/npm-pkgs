import { args, Argv } from '@rondymesquita/args'
import { TaskNotFoundError } from './errors'

export { Options } from '@rondymesquita/args'
export interface TaskContext {
  argv: Argv
}
export type Task = (ctx: TaskContext) => void
export interface TaskDef {
  [key: string]: Task | TaskDef
}

const buildTaskName = (namespace: string, fnName: string) => {
  let name: string = namespace ? `${namespace}:${fnName}` : fnName

  if (name !== 'default' && name.includes('default')) {
    name = name.replace(':default', '')
  }

  return name
}

const createTasks = (
  taskDef: TaskDef,
  tasks: any = {},
  namespace: string = '',
): any => {
  Object.entries(taskDef).forEach((def: any) => {
    const fnName = def[0]
    let name = buildTaskName(namespace, fnName)

    const fnOrNamespaceDef = def[1]
    if (typeof fnOrNamespaceDef === 'function') {
      tasks[name] = fnOrNamespaceDef
      return
    }

    createTasks(fnOrNamespaceDef, tasks, name)
  })

  return tasks
}

export const tasks = async (taskDef: TaskDef) => {
  const argv = args(process.argv.slice(2))
  // const argv = args('test:watch --dev --name=fulano sicrano'.split(' '))
  const name = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  const tasks = createTasks(taskDef)
  console.log(tasks)

  let task: Task
  if (name) {
    task = tasks[name] as Task
  } else {
    task = tasks.default as Task
  }

  if (!task) {
    throw new TaskNotFoundError(name)
  }

  await task(ctx)
}
