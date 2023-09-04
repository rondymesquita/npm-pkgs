import * as models from './models'
import * as libs from './libs'
import * as shell from './shell'
import * as service from './service'
import * as tasks from '@rondymesquita/tasks'
import * as args from '@rondymesquita/args'
import { Shell } from './shell/shell'

Object.assign(global, models)
Object.assign(global, libs)
Object.assign(global, service)
Object.assign(global, tasks)
Object.assign(global, args)

declare global {
  const Service: typeof service.Service
  // const Shell: typeof shell.Shell
  const shell: typeof Shell
  const $: typeof shell.$
  const cd: typeof shell.cd
  const setOptions: typeof shell.setOptions
  const exec: typeof shell.exec
  const execAsync: typeof shell.execAsync
  const fork: typeof shell.fork
  const ls: typeof shell.ls
  const spawn: typeof shell.spawn
  const withContext: typeof shell.withContext
}
