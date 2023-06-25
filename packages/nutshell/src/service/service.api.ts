import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'
import { ServiceDecorator } from './service.decorator'
import { ServiceOptions } from '.'

export class Service extends ServiceDecorator {
  constructor(options: ServiceOptions) {
    super(ChildProcess, Path, FS, Process, options)
  }
}
