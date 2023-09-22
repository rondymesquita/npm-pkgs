import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'

import { defineFile } from './file'
import { useGlobalOptions } from './shared'
import { defineShell } from './shell'

export { DEFAULT_OPTIONS } from './shared'
export const { options, setOptions, } = useGlobalOptions()
export const {
  cd,
  copy,
  exec,
  execAsync,
  fork,
  ls,
  move,
  replicate,
  run,
  runAsync,
  spawn,
  withContext,
} = defineShell(ChildProcess, Process, FS)


export const { file, } = defineFile(Process, FS, Path)
