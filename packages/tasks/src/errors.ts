export class TaskNotFoundError extends Error {
  constructor(name: string) {
    super(`Task with name "${name}" was not found`)
  }
}

export class TaskNameNotInformedError extends Error {
  constructor() {
    super(`Task name was not informed`)
  }
}
