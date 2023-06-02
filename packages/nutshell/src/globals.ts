import * as models from './models'
import * as libs from './libs'
import * as core from './core'
import * as tasks from '@rondymesquita/tasks'
import * as args from '@rondymesquita/args'

Object.assign(global, models)
Object.assign(global, libs)
Object.assign(global, core)
Object.assign(global, tasks)
Object.assign(global, args)

declare global {
  const $: typeof core.$
  const withContext: typeof core.withContext
  const cd: typeof core.cd
  const setConfig: typeof core.setConfig
  const ls: typeof core.ls
  const chalk: typeof libs.chalk
  const fs: typeof libs.fs
}
