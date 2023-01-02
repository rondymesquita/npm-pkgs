export class TaskNotFoundError extends Error {
  constructor(name: string) {
    super(`Task with name "${name}" was not found`)
  }
}
