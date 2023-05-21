import { flow } from '.'
import { Context } from './types'

const stages = [
  // (ctx: Context) => {
  //   console.log('args', ctx)
  (user: any, ctx: Context) => {
    console.log('args', user, ctx)
  },
]
const { run, provideArgs } = flow(stages)
provideArgs((context: Context) => {
  return [{ name: 'rondy' }, context]
})
run()
