import { parseDotenvFile } from './parser'
import * as infra from './infra'
import { z } from 'zod'

export interface CoreInput {
  fs: infra.IFS
  path: infra.IPath
}

export interface Definition {
  cwd?: string
  filename?: string
  schema?: z.ZodObject<any> | null
}

const DEFAULT: Required<Definition> = {
  cwd: process.cwd(),
  filename: '.env',
  schema: null,
}

export interface Env {
  [key: string]: any
}

const createParser = (fs: infra.IFS, path: infra.IPath) => {
  return (definition: Required<Definition>) => {
    const { cwd, filename, schema } = definition
    const filePath = path.resolve(cwd, filename)
    const file = fs.readFileSync(filePath).toString()
    let env = parseDotenvFile(file)

    if (schema) {
      env = schema.parse(env)
    }

    return env as any
  }
}

export const CoreFactory = ({ fs, path }: CoreInput) => {
  const parseDotenv = <T>(definition?: Definition): T => {
    const parser = createParser(fs, path)
    const finalDefinition = definition ? { ...DEFAULT, ...definition } : DEFAULT
    return parser(finalDefinition)
  }
  return {
    parseDotenv,
  }
}

export const { parseDotenv } = CoreFactory({
  fs: infra.FS,
  path: infra.Path,
})
