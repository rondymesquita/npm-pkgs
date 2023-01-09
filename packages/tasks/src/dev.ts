import { TaskContext, tasks } from './index'

function build(ctx: TaskContext) {
  console.log('building', ctx)
}

const clean = async (ctx: TaskContext) => {
  console.log('cleaning', ctx)
  await new Promise((res) => setTimeout(res, 2000))
}

const test: any = {
  watch: (ctx: TaskContext) => {
    console.log('test:watch')
  },
  default: (ctx: TaskContext) => {
    console.log('test')
  },
  cov: {
    watch: (ctx: TaskContext) => {
      console.log('test:cov:watch')
    },
    default: [clean, build],
  },
}

tasks({
  clean,
  build: [clean, build],
  test,
})
