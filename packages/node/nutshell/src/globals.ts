import * as args from '@rondymesquita/args'
import * as t from '@rondymesquita/tasks'

import * as libs from './libs'
import * as models from './models'
import * as service from './service'
import * as shell from './shell'

Object.assign(global, libs)
Object.assign(global, models)
Object.assign(global, service)
Object.assign(global, shell)
Object.assign(global, args)
Object.assign(global, t)

// console.log(global)

declare global {
	const run: typeof shell.run
	const file: typeof shell.file
	const runAsync: typeof shell.runAsync
	const tasks: typeof t.tasks
	const cd: typeof shell.cd
	const options: typeof shell.options
	const setOptions: typeof shell.setOptions
	const exec: typeof shell.exec
	const execAsync: typeof shell.execAsync
	const fork: typeof shell.fork
	const ls: typeof shell.ls
	const spawn: typeof shell.spawn
	const withContext: typeof shell.withContext
}
