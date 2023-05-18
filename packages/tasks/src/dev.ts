import {
  help as argsHelp,
  required,
  defineValidator,
  type,
  ArgsDefinition,
} from '@rondymesquita/args'
import { Context, defineTasks, tasks, namespace, Task } from './index'

interface UnitArgs {
  name: string
  id: number
}
const unit = (ctx: Context) => {
  ctx
  ctx.getParams()
  ctx.getErrors()
  console.log('unit')
}

function e2e() {
  console.log('e2e')
}

tasks({
  unit,
  e2e,
})
