import * as models from './models'
import * as libs from './libs'
import * as coreLib from './core'
import * as serviceLib from './service'
import * as tasks from '@rondymesquita/tasks'
import * as args from '@rondymesquita/args'

Object.assign(global, models)
Object.assign(global, libs)
Object.assign(global, coreLib)
Object.assign(global, serviceLib)
Object.assign(global, tasks)
Object.assign(global, args)

declare global {
  const core: typeof coreLib.core
  const c: typeof coreLib.c
  const defineService: typeof serviceLib.defineService
  const ServiceAPI: typeof serviceLib.ServiceAPI
  // const core: core.
  // const exec: typeof core.exec
  // const execSync: typeof core.execSync
  // const execAsync: typeof core.execAsync
  // const spawn: typeof core.spawn
  // const cd: typeof core.cd
  // const withContext: typeof core.withContext
  // const setConfig: typeof core.setConfig
  // const ls: typeof core.ls
  // const config: typeof core.config
  // const chalk: typeof libs.chalk
}
