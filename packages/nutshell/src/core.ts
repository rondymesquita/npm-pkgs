import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import { DEFAULT_CONFIG } from './coredefaults'
import { createLogger } from './logger'
import { CmdResult, Config } from './models'
import { prepareCommand } from './utils'

const defineCoreFactory = () => {
  return defineCore({
    shell: { exec: ChildProcess.exec.__promisify__, spawn: ChildProcess.spawn },
    process,
    fs: {
      readdir: FS.readdir.__promisify__,
    },
  })
}

export const {
  $,
  exec,
  cd,
  withContext,
  setConfig,
  ls,
  config,
} = defineCoreFactory()

export interface DefineCoreInput {
  shell: {
    exec: typeof ChildProcess.exec.__promisify__
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
  exec: typeof $
  spawn: typeof ChildProcess.spawn
  cd: (dir: string) => void
  withContext: (fn: Function) => Promise<number | null>
  setConfig: (userConfig: Partial<Config>) => void
  ls: () => Promise<string[]>
  config: Config
}

export function defineCore({ shell, process, fs }: DefineCoreInput): Core {
  const { exec: shellExec, spawn: shellSpawn } = shell
  const { chdir, cwd } = process
  const { readdir } = fs

  let logger = createLogger(DEFAULT_CONFIG)
  let config = { ...DEFAULT_CONFIG }

  /**
   *
   * Runs a command using child_process.exec.
   */
  const exec = async (
    cmd: string | Array<string> | TemplateStringsArray,
  ): Promise<CmdResult | CmdResult[]> => {
    const finalCmd = prepareCommand(cmd)

    if (Array.isArray(finalCmd)) {
      const results: Array<CmdResult> = []
      for (const cmd of finalCmd) {
        logger.verbose(cmd)
        const result = await shellExec(cmd)
        logger.info(result.stdout)

        results.push(result)
      }
      return results
    } else {
      logger.verbose(finalCmd)
      const result = await shellExec(finalCmd)
      logger.info(result.stdout)

      return result
    }
  }

  const $ = exec

  const spawn = shellSpawn

  /**
   *
   * Changes current directory using process.chdir.
   */
  const cd = (dir: string) => {
    logger.debug(`cd ${dir}`)
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
        logger.error(error)
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
    logger.verbose('ls')
    const stdout = await readdir(cwd())
    logger.info(stdout)
    return stdout
  }

  return {
    $,
    exec,
    spawn,
    cd,
    withContext,
    setConfig,
    ls,
    config,
  }
}
