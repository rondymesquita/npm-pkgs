import { IShell } from '.'
import { ShellComponent } from './shell.component'
import * as FS from 'fs'
import Process from 'process'
import * as ChildProcess from 'child_process'
import { ShellOptions } from '.'

export class Shell extends ShellComponent implements IShell {
  constructor(options: ShellOptions) {
    super(ChildProcess, Process, FS, options)
  }
}
