import * as ChildProcess from 'child_process'
import * as FastGlob from 'fast-glob'
import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'

import { defineFile } from './file'
import { defineJson } from './json'
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
} = defineShell(ChildProcess, Process, FS, FastGlob.sync)


export const { file, } = defineFile(Process, FS, Path)
export const { json, } = defineJson(defineFile(Process, FS, Path))
