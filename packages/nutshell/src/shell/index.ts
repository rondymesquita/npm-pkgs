import { exportClassMembers } from '../utils'
import { Shell } from './shell'

import * as FS from 'fs'
import Process from 'process'
import * as ChildProcess from 'child_process'

const shell = new Shell(ChildProcess, Process, FS)
export const {
  $,
  cd,
  exec,
  execAsync,
  fork,
  ls,
  setOptions,
  spawn,
  withContext,
} = exportClassMembers<Shell>(shell)
