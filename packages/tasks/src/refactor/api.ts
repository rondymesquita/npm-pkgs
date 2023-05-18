import { parseArgs } from '@rondymesquita/args'

export type TaskFn = () => Promise<any> | any

export interface Definition {
  [key: string]: TaskFn | TaskFn[] | Definition
}

export class Task {
  constructor() {}
}

export class ArgsDefiner {
  define() {
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
  }
}

export class API {
  tasks(definition: Definition) {
    // const definer = new Definer(definition)
  }
}
