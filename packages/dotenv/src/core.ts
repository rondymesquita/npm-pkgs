import { parseDotenvFile } from './parser'
import * as infra from './infra'

export interface CoreInput {
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

export interface Env {
  [key: string]: any
}

// class Parser {
//   private definition: Required<Definition>
//   constructor(private fs: infra.IFS, private path: infra.IPath) {}
//   setDefinition(definition: Required<Definition>) {
//     this.definition = definition
//   }
//   parseDotenv() {
//     const { cwd, filename } = this.definition
//     const filePath = this.path.resolve(cwd, filename)
//     const file = this.fs.readFileSync(filePath).toString()
//     let env = parseDotenvFile(file)
//     return env
//   }
// }

// export class Core {
//   private parser: Parser
//   constructor(private fs: infra.IFS, private path: infra.IPath) {
//     this.parser = new Parser(this.fs, this.path)
//     this.parser.setDefinition(DEFAULT)
//   }

//   defineDotenv(definition?: Definition) {
//     const d: Required<Definition> = {
//       ...DEFAULT,
//       ...definition,
//     }
//     this.parser.setDefinition(d)
//   }

//   parseDotenv() {
//     return this.parser.parseDotenv()
//   }
// }

const createParser = (fs: infra.IFS, path: infra.IPath) => {
  return (definition: Required<Definition>) => {
    const { cwd, filename } = definition
    const filePath = path.resolve(cwd, filename)
    const file = fs.readFileSync(filePath).toString()
    let env = parseDotenvFile(file)
    return env
  }
}

export const CoreFactory = ({ fs, path }: CoreInput) => {
  const parseDotenv = (definition?: Definition) => {
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
