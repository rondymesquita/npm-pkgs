import { Status } from '@rondymesquita/flow'
import { flow } from '@rondymesquita/flow'
import { checkLength, checkType } from './check'

export interface Validators {
  type: string
  length?: number
}

// class BaseSchema {
//   protected validators: Validators = { type: 'string' }
// }

interface Definition {
  [key: string]: BaseSchema
}

// class InitialDefinition {
//   string() {
//     return new StringSchema()
//   }
// }

interface InitialDefinition {}

const createInitialDefinition = () => {
  return {
    string() {
      console.log(this)
      return this
    },
  }
}

class ObjectSchema {
  private definition: Definition
  setDefinition(definition: Definition) {
    this.definition = definition
  }

  parse(obj: any) {
    console.log(typeof obj, obj)

    for (const key in this.definition) {
      const definition = this.definition[key]
      const value = obj[key]
      const validators = (definition as any).validators

      const { context, setStages, run } = flow()
      context.set('meta', { validators, value })

      setStages([checkType, checkLength])

      const results = run()
      const errors = results.filter((result) => result.status === Status.FAIL)
      if (errors.length > 0) {
        throw new Error(results.map((r) => r.data).join())
      }
    }
  }
}

interface BaseSchema {
  validators: Validators
}

const createBaseSchema = (): BaseSchema => ({
  validators: { type: 'string' },
})

interface StringSchema extends BaseSchema {
  length: (value: number) => this
  parse: (value: any) => void
}

const createStringSchema = (): StringSchema => {
  const { validators } = createBaseSchema()
  return {
    validators,
    length(value: number) {
      this.validators.length = value
      return this
    },

    parse(value: any) {
      const { context, setStages, run } = flow()
      context.set('meta', { validators: this.validators, value })

      setStages([checkType, checkLength])

      const results = run()
      const errors = results.filter((result) => result.status === Status.FAIL)
      if (errors.length > 0) {
        throw new Error(results.map((r) => r.data).join())
      }
    },
  }
}

// class StringSchema extends BaseSchema {
//   constructor() {
//     super()
//     this.validators.type = 'string'
//   }
//   length(value: number) {
//     this.validators.length = value
//     return this
//   }

//   parse(value: any) {
//     const { context, setStages, run } = flow()
//     context.set('meta', { validators: this.validators, value })

//     setStages([checkType, checkLength])

//     const results = run()
//     const errors = results.filter((result) => result.status === Status.FAIL)
//     if (errors.length > 0) {
//       throw new Error(results.map((r) => r.data).join())
//     }
//   }
// }

export const v = (): InitialDefinition => {
  return createInitialDefinition()
}

export const schema = (definition: Definition) => {
  const objSchema = new ObjectSchema()
  objSchema.setDefinition(definition)
  return objSchema
}

export const string = () => {
  return createStringSchema()
}
