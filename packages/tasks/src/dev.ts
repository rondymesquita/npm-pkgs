import {
  help as argsHelp,
  required,
  defineValidator,
  type,
  ArgsDefinition,
} from '@rondymesquita/args'
import { Context, defineTasks, tasks, Task } from './index'

function jobid(options, ctx) {
  ctx.set('id', 12345)
}

async function clean(options, ctx) {
  console.log('cleaning', ctx.get('id'))
  await new Promise((res) => setTimeout(res, 2000))
}

function build(options, ctx) {
  console.log('building', ctx.get('id'))
}

tasks({
  build: [jobid, clean, build],
})
