import { TaskContext, tasks } from './index'

const build = (ctx: TaskContext) => {
  console.log('building', ctx)
}

const test = {
  watch: (ctx: TaskContext) => {
    console.log('test:watch')
  },
  default: (ctx: TaskContext) => {
    console.log('test')
  },
  clean: {
    watch: (ctx: TaskContext) => {
      console.log('test:watch')
    },
    default: (ctx: TaskContext) => {
      console.log('test')
    },
  },
}

tasks({
  default: build,
  build,
  test,
})
