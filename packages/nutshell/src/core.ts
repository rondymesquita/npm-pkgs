import { fork } from 'child_process'
import { DEFAULT_CONFIG } from './coredefaults'
import { createLogger } from './logger'
import { CmdResult, Config } from './models'
import { prepareCommand } from './utils'
import * as shell from './infra/shell'
import * as fs from './infra/fs'

const defineCoreFactory = () => {
  return defineCore({ shell, process, fs })
}

export const { $, cd, withContext, setConfig, ls, config } = defineCoreFactory()

export class DefineCoreInput {
  public shell: shell.Shell
  public process: Pick<NodeJS.Process, 'chdir' | 'cwd'>
  public fs: fs.FS
}

export function defineCore({ shell, process, fs }: DefineCoreInput) {
  const { exec } = shell
  const { chdir, cwd } = process
  const { readdir } = fs

  let logger = createLogger(DEFAULT_CONFIG)
  let config = { ...DEFAULT_CONFIG }

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
        logger.verbose(cmd)
        const result = await exec(cmd)
        logger.info(result.stdout)

        results.push(result)
      }
      return results
    } else {
      logger.verbose(finalCmd)
      const result = await exec(finalCmd)
      logger.info(result.stdout)

      return result
    }
  }

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
  const withContext = async (fn: Function) => {
    const childProcess = fork(`${__dirname}/subprocess`, ['subprocess'])
    childProcess.send({ fn: fn.toString() })

    return new Promise((resolve, reject) => {
      childProcess.on('close', (exitCode) => {
        resolve({ exitCode })
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
    cd,
    withContext,
    setConfig,
    ls,
    config,
  }
}
