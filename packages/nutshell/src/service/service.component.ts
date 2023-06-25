import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'
import { exportClassMembers, merge } from '../utils'
import { IService, ServiceOptions, ServiceSettings } from '.'

export class ServiceComponent implements IService {
  private settings: ServiceSettings
  private DEFAULT_OPTIONS: Partial<ServiceOptions>
  constructor(
    private childProcess: typeof ChildProcess,
    private path: typeof Path,
    private fs: typeof FS,
    private process: typeof Process,
    private options: ServiceOptions,
  ) {
    this.DEFAULT_OPTIONS = {
      cwdLog: this.process.cwd(),
      cwdPid: this.process.cwd(),
    }

    this.options = merge(options, this.DEFAULT_OPTIONS)
    const { name, cwdLog, cwdPid } = this.options as Required<ServiceOptions>

    this.fs.mkdirSync(cwdPid, { recursive: true })
    const pidPath = this.path.resolve(cwdPid, `${name}.pid`)
    const outLog = this.fs.openSync(
      this.path.resolve(cwdLog, `${name}.log`),
      'a',
    )
    const errLog = this.fs.openSync(
      this.path.resolve(cwdLog, `${name}-err.log`),
      'a',
    )

    this.settings = {
      pidPath,
      errLog,
      outLog,
    }
  }

  start() {
    const { command, cwdLog, cwdPid, shell } = this.options as Required<
      ServiceOptions
    >
    const { errLog, outLog, pidPath } = this.settings as Required<
      ServiceSettings
    >
    const subprocess = this.childProcess.spawn(command, {
      shell: 'bash',
      detached: true,
      stdio: ['ignore', outLog, errLog],
    })

    this.fs.writeFileSync(pidPath, String(subprocess.pid), { flag: 'w' })
    subprocess.unref()
  }

  stop() {
    if (this.fs.existsSync(this.settings.pidPath)) {
      const pid = this.fs.readFileSync(this.settings.pidPath).toString()
      this.childProcess.execSync(`kill -9 ${pid}`)
      this.fs.rmSync(this.settings.pidPath, { force: true })
    }
  }
  restart() {
    this.stop()
    this.start()
  }
}
