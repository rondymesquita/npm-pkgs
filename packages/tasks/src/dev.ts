import {
  help as argsHelp,
  required,
  defineValidator,
  type,
  ArgsDefinition,
} from '@rondymesquita/args'
import { Context, defineTasks, tasks, Task } from './index'

async function clean() {
  return new Promise((res) => {
    console.log('running clean')
    setTimeout(() => {
      console.log('cleaned')
      res({})
    }, 1000)
  })
}

const unit = ({ watch, help }: any, ctx: any) => {
  console.log('>>> running unit', { watch, help }, ctx)
}

tasks({
  unit: [clean, unit],
  // unit,
})
