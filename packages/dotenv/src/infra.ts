import { exportClassMembers } from './utils'
import { PathLike } from 'fs'
import fs from 'fs'
import path from 'path'

export interface IFS {
  readFileSync: (path: PathLike) => Buffer
}
class FSAdapter implements IFS {
  readFileSync(path: PathLike): Buffer {
    return fs.readFileSync(path)
  }
}

export const FS = exportClassMembers<IFS>(new FSAdapter())

export interface IPath {
  resolve: (...paths: string[]) => string
}
class PathAddapter implements IPath {
  resolve(...paths: string[]): string {
    return path.resolve(...paths)
  }
}
export const Path = exportClassMembers<IPath>(new PathAddapter())
