import { args, Argv } from '@rondymesquita/args'
import { TaskNotFoundError } from './errors'

export { Options } from '@rondymesquita/args'
export interface TaskContext {
  argv: Argv
}
export type Task = (ctx: TaskContext) => void
// export type TaskDef = Record<string, Task | Record<string, Task>>
export interface TaskDef {
  [key: string]: Task | TaskDef
}

const createTasks = (taskDef: TaskDef, name: string = ''): any => {
  // console.log(taskDef)
  const entries = Object.entries(taskDef).map((def: any) => {
    // console.log(def[1], typeof def[1])
    const taskName = name ? `${name}:${def[0]}` : def[0]
    if (typeof def[1] === 'function') {
      return [taskName, def[1]]
    } else {
      return createTasks(def[1], taskName)
    }
  })

  return entries.flatMap((x) => {
    console.log(x)
    return x
  })
}

export const tasks = async (taskDef: TaskDef) => {
  const argv = args(process.argv.slice(2))
  const taskName = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  let tasks = createTasks(taskDef)
  console.log(tasks)

  for (let index = 0; index < tasks.length; index += 2) {
    const name = tasks[index]
    const handler = tasks[index + 1]
  }

  // if (taskName) {
  //   task = taskDef[taskName]
  // } else {
  //   task = taskDef.default
  // }

  // if (!task) {
  //   throw new TaskNotFoundError()
  // }

  // await task(ctx)
}
