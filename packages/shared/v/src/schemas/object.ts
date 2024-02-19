import { Status, flow } from '@rondymesquita/flow'
import { checkLength, checkType } from '../check'
import { Definition } from './base'

export class ObjectSchema {
  private definition: Definition
  setDefinition(definition: Definition) {
    this.definition = definition
  }

  parse(obj: any) {
    for (const key in this.definition) {
      const definitionValue = this.definition[key]
      const value = obj[key]
      const validators = (definitionValue as any).validators

      const { context, setStages, run } = flow()
      context.set('meta', { validators, value })

      setStages([checkType, checkLength])

      const results = run()
      const errors = results.filter((result) => result.status === Status.FAIL)
      if (errors.length > 0) {
        console.error(errors)
        throw new Error(results.map((r) => r.data).join())
      }
    }
  }
}
