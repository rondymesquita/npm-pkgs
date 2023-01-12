import { TaskContext, tasks, namespace, help } from './index'

help(build, 'build app')
function build(ctx: TaskContext) {
  console.log('building', ctx)
}

help(clean, 'clean app')
async function clean(ctx: TaskContext) {
  console.log('cleaning', ctx)
  await new Promise((res) => setTimeout(res, 2000))
}

const test = namespace('test', ({ help, tasks }) => {
  help(build, 'build app')
  function build(ctx: TaskContext) {
    console.log('building', ctx)
  }

  help(clean, 'clean app')
  async function clean(ctx: TaskContext) {
    console.log('cleaning', ctx)
    await new Promise((res) => setTimeout(res, 2000))
  }

  return tasks({ clean, build: [clean, build] })
})

tasks({
  clean,
  build: [clean, build],
  ...test,
})
