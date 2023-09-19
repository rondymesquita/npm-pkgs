import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'

import { useGlobalOptions } from './shared'

interface File {
	data: string | null,
	content: (data: string) => File
	read: () => void
	write: () => void
}


export const defineFile = (
  childProcess: typeof ChildProcess,
  process: typeof Process,
  fs: typeof FS,
  path: typeof Path
) => {

  const { options, } = useGlobalOptions()

  const file = function (name:string) {
    const self = {
      data: '',
      content (data: string) {
        this.data = data
        return self
      },
      write() {
        fs.writeFileSync(path.resolve(process.cwd(), name), this.data, { encoding:'utf8', })
      },
      read() {
        const content = fs.readFileSync(path.resolve(process.cwd(), name), { encoding: 'utf8', })
        return content
      },
      replace(searchValue: string | RegExp, replaceValue: string){
        const content = this.read()
        this.data = content.replaceAll(searchValue, replaceValue)
        this.write()
      },
    }
    return self
  }

  return { file, }
}

export const { file, } = defineFile(ChildProcess, Process, FS, Path)
