import { args, Argv } from '@rondymesquita/args'
import { TaskNotFoundError } from './errors'

export { Options } from '@rondymesquita/args'
export interface TaskContext {
  argv: Argv
}
export type Task = (ctx: TaskContext) => void
export type TaskDef = Record<string, Task | Record<string, Task>>
export const tasks = async (taskDef: TaskDef) => {
  const argv = args(process.argv.slice(2))
  const taskName = argv.params[0]

  const ctx: TaskContext = {
    argv,
  }

  let task

  if (taskName) {
    task = taskDef[taskName]
  } else {
    task = taskDef.default
  }

  if (!task) {
    throw new TaskNotFoundError()
  }

  await task(ctx)
}
