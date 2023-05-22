import { flow } from '.'
import { Context } from './types'

const stages = [
  (pirate: any, ctx: Context) => {
    console.log('args', pirate, ctx)
  },
]
const { run, provideArgs } = flow(stages)
provideArgs((context: Context) => {
  const pirate = { name: 'Jack Sparrow' }
  return [pirate, context]
})
run()
