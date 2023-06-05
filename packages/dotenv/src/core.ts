import { parseDotenvFile } from './parser'
import * as infra from './infra'

export interface DefineCoreInput {
  fs: infra.IFS
  path: infra.IPath
}

export interface Definition {
  cwd?: string
  filename?: string
}

const DEFAULT = {
  cwd: process.cwd(),
  filename: '.env',
}

export const { defineDotenv } = defineCore({ fs: infra.FS, path: infra.Path })
export const { parseDotenv } = defineDotenv()

export function defineCore({ fs, path }: DefineCoreInput) {
  const defineDotenv = (definition?: Definition) => {
    const { cwd, filename } = {
      ...DEFAULT,
      ...definition,
    }

    const parseDotenv = () => {
      const filePath = path.resolve(cwd, filename)
      const file = fs.readFileSync(filePath).toString()
      const env = parseDotenvFile(file)
      return env
    }
    return {
      parseDotenv,
    }
  }
  return { defineDotenv }
}
