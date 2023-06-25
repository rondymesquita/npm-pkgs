import * as models from './models'
import * as libs from './libs'
import * as shell from './shell'
import * as core from './core'
import * as service from './service'
import * as tasks from '@rondymesquita/tasks'
import * as args from '@rondymesquita/args'

Object.assign(global, models)
Object.assign(global, libs)
Object.assign(global, core)
Object.assign(global, service)
Object.assign(global, tasks)
Object.assign(global, args)

declare global {
  const Service: typeof service.Service
  const Shell: typeof shell.Shell
}
