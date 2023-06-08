import { defineDotenv } from './'
import { z } from 'zod'

const MY = z.object({
  DEV: z.coerce.string(),
})

const { parseDotenv } = defineDotenv({
  // cwd: process.
  filename: '.env-dev',
})

// interface MY {
//   DEV: number
// }

const env = parseDotenv(MY)

console.log(env)
