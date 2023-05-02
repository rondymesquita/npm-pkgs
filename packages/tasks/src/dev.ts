import {
  help as argsHelp,
  required,
  defineValidator,
  type,
} from '@rondymesquita/args'
import { Context, defineTasks, tasks, args, namespace, help } from './index'

// const { tasks, args, namespace } = defineTasks()

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})

// args(build, { options: [number('id', [max(3)])] })
args(build, { options: { id: [type('number'), max(3)] } })
// help(build, 'test2')
function build(ctx: Context) {
  console.log('building')
}

// args(clean, {
//   options: [string('dir', []), number('id', [max(3)])],
// })
async function clean(ctx: Context) {
  console.log('cleaning', ctx)
  // throw new Error('deu um erro aqui')
  await new Promise((res) => setTimeout(res, 2000))
}

const test = namespace('test', ({ tasks, args }) => {
  // args(unit, {
  //   options: [
  //     // string('reporter', [help('Reporter format'), required()]),
  //     // helpOption('help', 'run unit tests'),
  //   ],
  // })
  help(unit, 'run unit tests')
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
  // prepare: [clean, build],
  default: [clean, build],
  ...test,
})
