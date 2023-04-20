import { help, helpOption, required } from '@rondymesquita/args'
import {
  Context,
  tasks,
  namespace,
  args,
  defineValidator,
  number,
  string,
} from './index'

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})

// help(build, 'build app')
args(build, { options: [number('id', [max(3)])] })
function build(ctx: Context) {
  console.log('building', ctx)
}

// help(clean, 'clean app')
args(clean, { options: [string('dir', []), number('id', [max(3)])] })
async function clean(ctx: Context) {
  console.log('cleaning', ctx)
  await new Promise((res) => setTimeout(res, 2000))
}

const test = namespace('test', ({ tasks, args }) => {
  // help(unit, 'run unit tets')
  args(unit, {
    options: [
      string('reporter', [help('Reporter format'), required()]),
      helpOption('help', 'run unit tests'),
    ],
  })
  function unit(ctx: Context) {
    console.log('running unit tests', ctx)
  }

  async function e2e(ctx: Context) {
    console.log('runnint e2e tests', ctx)
    await new Promise((res) => setTimeout(res, 2000))
  }

  return tasks({ default: unit, e2e, unit })
})

tasks({
  build,
  clean,
  default: build,
  ...test,
})
