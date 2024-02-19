import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'

import { IFileString } from '../models'


export const defineFile = (
  process: typeof Process,
  fs: typeof FS,
  path: typeof Path
) => {

  const file = function(name:string) {

    const self: IFileString = {
      write(content: string = '') {
        fs.writeFileSync(path.resolve(process.cwd(), name), content, { encoding:'utf8', })
      },
      read() {
        const _content = fs.readFileSync(path.resolve(process.cwd(), name), { encoding: 'utf8', })
        return _content
      },
      replace(searchValue: string | RegExp, replaceValue: string){
        let content = self.read()
        content = content.replaceAll(searchValue, replaceValue)
        self.write(content)
      },
    }
    return self
  }

  return { file, }
}
