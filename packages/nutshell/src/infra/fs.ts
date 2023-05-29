import { PathLike } from 'fs'
import fs from 'fs'

import { promisify } from 'util'
const readdirAsync = promisify(fs.readdir)

export interface FS {
  readdir: (path: PathLike) => Promise<string[]>
}

export const readdir = async (path: PathLike): Promise<string[]> => {
  return await readdirAsync(path)
}
