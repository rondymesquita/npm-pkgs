import * as FS from 'fs'
import { DEFAULT_CONFIG } from './coredefaults'
import { CmdResult, Config } from './models'
import { prepareCommand } from './utils'
import Process from 'process'
import { ChildProcessExtended } from './child-process-extended'
import * as ChildProcess from 'child_process'
import { promisify } from 'util'
export class Core {
  public config: Config
  constructor(
    private childProcess: typeof ChildProcess,
    private process: typeof Process,
    private fs: typeof FS,
  ) {
    this.config = { ...DEFAULT_CONFIG }
  }

  /**
   *
   * Runs a command using child_process.exec.
   */
  async $(
    cmd: string | Array<string> | TemplateStringsArray,
  ): Promise<CmdResult | CmdResult[]> {
    const finalCmd = prepareCommand(cmd)

    if (Array.isArray(finalCmd)) {
      const results: Array<CmdResult> = []
      for (const cmd of finalCmd) {
        const result = await this.childProcess.execAsync(cmd)
        console.log(result.stdout)
        results.push(result)
      }
      return results
    } else {
      const result = await this.childProcess.execAsync(finalCmd)
      console.log(result.stdout)
      return result
    }
  }

  /**
   *
   * Changes current directory using process.chdir.
   */
  cd(dir: string) {
    console.log('cd', dir)
    this.process.chdir(dir)
  }

  /**
   *
   * Run a command in a separated process using child_process.fork.
   */
  async withContext(fn: Function): Promise<number | null> {
    const childProcess = this.childProcess.fork(`${__dirname}/subprocess`, [
      'subprocess',
    ])
    childProcess.send({ fn: fn.toString() })

    return new Promise((resolve, reject) => {
      childProcess.on('close', (exitCode: any) => {
        resolve(exitCode)
      })
      childProcess.on('error', (error: Error) => {
        reject(error)
      })
    })
  }

  /**
   *
   * Update new configuration.
   */
  setConfig(userConfig: Partial<Config>) {
    Object.assign(this.config, userConfig)
    // logger = createLogger(config)
  }

  /**
   *
   * Lists file and directories from current working directory.
   */
  async ls() {
    const stdout = await this.fs.readdirSync(this.process.cwd())
    return stdout
  }

  execAsync(...params: Parameters<typeof ChildProcess.exec.__promisify__>) {
    return promisify(this.childProcess.exec)(...params)
  }
  exec(...params: Parameters<typeof ChildProcess.execSync>) {
    const stringOrBuffer = this.childProcess.execSync(...params)
    let res = stringOrBuffer
    if (stringOrBuffer instanceof Buffer) {
      res = stringOrBuffer.toString('utf8')
    }
    return res
  }
  spawn(...params: Parameters<typeof ChildProcess.spawn>) {
    return this.childProcess.spawn(...params)
  }
  fork(...params: Parameters<typeof ChildProcess.fork>) {
    return this.childProcess.fork(...params)
  }
}

// const childProcessExtended = new ChildProcessExtended(ChildProcess)
export const core = new Core(ChildProcess, Process, FS)
export const c = core
