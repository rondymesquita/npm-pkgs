import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import { DEFAULT_CONFIG } from './coredefaults'
import { createLogger } from './logger'
import { CmdResult, Config } from './models'
import { prepareCommand } from './utils'
import { promisify } from 'util'
import { log } from 'console'
// import { prii } from './utils'

const defineCoreFactory = () => {
  return defineCore({
    childProcess: {
      execAsync: promisify(ChildProcess.exec),
      execSync: ChildProcess.execSync,
      exec: ChildProcess.execSync,
      spawn: ChildProcess.spawn,
    },
    process,
    fs: {
      readdir: FS.readdir.__promisify__,
    },
  })
}

export const {
  $,
  exec,
  execSync,
  execAsync,
  spawn,
  cd,
  withContext,
  setConfig,
  ls,
  config,
} = defineCoreFactory()

export interface DefineCoreInput {
  childProcess: {
    execAsync: typeof ChildProcess.exec.__promisify__
    execSync: typeof ChildProcess.execSync
    exec: typeof ChildProcess.execSync
    spawn: typeof ChildProcess.spawn
  }
  process: Pick<NodeJS.Process, 'chdir' | 'cwd'>
  fs: {
    readdir: typeof FS.readdir.__promisify__
  }
}

export interface Core {
  $: (
    cmd: string | Array<string> | TemplateStringsArray,
  ) => Promise<CmdResult | CmdResult[]>
  execAsync: typeof ChildProcess.exec.__promisify__
  execSync: typeof ChildProcess.execSync
  exec: typeof ChildProcess.execSync
  spawn: typeof ChildProcess.spawn
  cd: (dir: string) => void
  withContext: (fn: Function) => Promise<number | null>
  setConfig: (userConfig: Partial<Config>) => void
  ls: () => Promise<string[]>
  config: Config
}

export function defineCore({
  childProcess,
  process,
  fs,
}: DefineCoreInput): Core {
  const { chdir, cwd } = process
  const { readdir } = fs

  let logger = createLogger(DEFAULT_CONFIG)
  let config = { ...DEFAULT_CONFIG }

  const execSync = childProcess.execSync
  const exec = execSync
  const execAsync = childProcess.execAsync
  const spawn = childProcess.spawn

  /**
   *
   * Runs a command using child_process.exec.
   */
  const $ = async (
    cmd: string | Array<string> | TemplateStringsArray,
  ): Promise<CmdResult | CmdResult[]> => {
    const finalCmd = prepareCommand(cmd)

    if (Array.isArray(finalCmd)) {
      const results: Array<CmdResult> = []
      for (const cmd of finalCmd) {
        const result = await execAsync(cmd)
        console.log(result.stdout)
        results.push(result)
      }
      return results
    } else {
      const result = await execAsync(finalCmd)
      console.log(result.stdout)
      return result
    }
  }

  /**
   *
   * Changes current directory using process.chdir.
   */
  const cd = (dir: string) => {
    console.log('cd', dir)
    chdir(dir)
  }

  /**
   *
   * Run a command in a separated process using child_process.fork.
   */
  const withContext = async (fn: Function): Promise<number | null> => {
    const childProcess = ChildProcess.fork(`${__dirname}/subprocess`, [
      'subprocess',
    ])
    childProcess.send({ fn: fn.toString() })

    return new Promise((resolve, reject) => {
      childProcess.on('close', (exitCode) => {
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
  const setConfig = (userConfig: Partial<Config>) => {
    Object.assign(config, userConfig)
    logger = createLogger(config)
  }

  /**
   *
   * Lists file and directories from current working directory.
   */
  const ls = async () => {
    const stdout = await readdir(cwd())
    return stdout
  }

  return {
    $,
    exec,
    execSync,
    execAsync,
    spawn,
    cd,
    withContext,
    setConfig,
    ls,
    config,
  }
}
