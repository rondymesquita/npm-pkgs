import { Definition, ObjectSchema, StringSchema } from './schemas'

class InitialDefinition {
  string() {
    return new StringSchema()
  }
}

export const v = (): InitialDefinition => {
  return new InitialDefinition()
}

export const schema = (definition: Definition) => {
  const objSchema = new ObjectSchema()
  objSchema.setDefinition(definition)
  return objSchema
}
