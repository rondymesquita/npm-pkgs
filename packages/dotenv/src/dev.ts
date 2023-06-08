import { parseDotenv } from './'
import { z } from 'zod'

const schema = z.object({
  DEV: z.coerce.number(),
})

type Schema = z.infer<typeof schema>

const env: Schema = parseDotenv({
  filename: '.env-dev',
  schema,
})

console.log(env)
