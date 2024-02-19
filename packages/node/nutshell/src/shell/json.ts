
import { IFile } from '../models'
import { defineFile } from './file'

export const defineJson = (
  { file, }: ReturnType<typeof defineFile>
) => {

  const json = function(name:string) {

    const f = file(name)

    const self: IFile<object> = {
      write(content: any = {}) {
        f.write(JSON.stringify(content))
      },
      read(): Record<any, any> {
        const stringContent = f.read()
        return JSON.parse(stringContent)
      },
    }
    return self
  }

  return { json, }
}
