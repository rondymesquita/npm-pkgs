import { v, schema } from './'

const Schema = schema({
  name: v().string().length(4),
})

Schema.parse({
  name: 'casa',
})

const fulano = v().string()
// fulano.
