import { Status, flow } from '@rondymesquita/flow'
import { checkLength, checkType } from '../check'
import { BaseSchema } from './base'

export class StringSchema extends BaseSchema {
  constructor() {
    super()
    this.validators.type = 'string'
  }
  length(value: number) {
    this.validators.length = value
    return this
  }
  parse(value: any) {
    const { context, setStages, run } = flow()
    context.set('meta', { validators: this.validators, value })

    setStages([checkType, checkLength])

    const results = run()
    const errors = results.filter((result) => result.status === Status.FAIL)
    if (errors.length > 0) {
      console.error(errors)
      throw new Error(results.map((r) => r.data).join())
    }
  }
}
