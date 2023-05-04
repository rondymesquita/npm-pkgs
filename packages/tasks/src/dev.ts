import {
  help as argsHelp,
  required,
  defineValidator,
  type,
} from '@rondymesquita/args'
import { Context, defineTasks, tasks, namespace } from './index'

// const { tasks, args, namespace } = defineTasks()

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})

// args(build, { options: { id: [type('number'), max(3)] } })
function build(ctx: Context) {
  console.log('building')
}

async function clean(ctx: Context) {
  console.log('cleaning', ctx)
  await new Promise((res) => setTimeout(res, 2000))
}

const test = namespace('test', ({ tasks }) => {
  // args(unit, {
  //   options: [
  //     // string('reporter', [help('Reporter format'), required()]),
  //     // helpOption('help', 'run unit tests'),
  //   ],
  // })
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
  default: [clean, build],
  ...test,
})
