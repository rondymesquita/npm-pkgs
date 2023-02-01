import { defineValidator, number, string } from '@rondymesquita/args'
import { TaskContext, tasks, namespace, help, args } from './index'

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})

help(build, 'build app')
args(build, { options: [number('id', [max(3)])] })
function build(ctx: TaskContext) {
  console.log('building', ctx)
}

help(clean, 'clean app')
args(clean, { options: [string('dir', [])] })
async function clean(ctx: TaskContext) {
  console.log('cleaning', ctx)
  await new Promise((res) => setTimeout(res, 2000))
}

const test = namespace('test', ({ help, tasks, args }) => {
  help(build, 'build app')
  args(build, { options: [string('quick', [])] })
  function build(ctx: TaskContext) {
    console.log('building', ctx)
  }

  help(clean, 'clean app')
  async function clean(ctx: TaskContext) {
    console.log('cleaning', ctx)
    await new Promise((res) => setTimeout(res, 2000))
  }

  return tasks({ default: build, clean, build: [clean, build] })
})

tasks({
  build,
  clean,
  default: build,
  ...test,
})
