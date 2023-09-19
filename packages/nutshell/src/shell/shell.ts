import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import path from 'path'
import * as Process from 'process'
import { promisify } from 'util'

import { CmdResult } from '../models'
import { prepareCommand } from '../utils'
import { useGlobalOptions } from './shared'


export const defineShell = (
  childProcess: typeof ChildProcess,
  process: typeof Process,
  fs: typeof FS
) => {

  const { options, } = useGlobalOptions()

  /**
     *
     * Changes current directory using process.chdir.
     */
  const cd = (dir: string) => {
    console.log('cd', dir)
    process.chdir(dir)
  }
  const exec = (...params: Parameters<typeof ChildProcess.execSync>) =>{
    const stringOrBuffer = childProcess.execSync(...params)
    let res = stringOrBuffer
    if (stringOrBuffer instanceof Buffer) {
      res = stringOrBuffer.toString('utf8')
    }
    return res

  }

  const execAsync =  (...params: Parameters<typeof ChildProcess.exec.__promisify__>) => {
    return promisify(childProcess.exec)(...params)
  }

  const run = (cmd: string | Array<string> | TemplateStringsArray): string | string[] => {
    const finalCmd = prepareCommand(cmd)

    if (Array.isArray(finalCmd)) {
      const results: Array<string> = []
      for (const cmd of finalCmd) {
        const result = exec(cmd)
        console.log(result)
        results.push(result.toString())
      }
      return results
    } else {

      const result = exec(finalCmd)
      console.log(result)
      return result.toString()
    }
  }

  /**
     *
     * Runs a command using child_process.exec.
     */
  const runAsync = async (cmd: string | Array<string> | TemplateStringsArray): Promise<CmdResult | CmdResult[]> => {
    const finalCmd = prepareCommand(cmd)

    if (Array.isArray(finalCmd)) {
      const results: Array<CmdResult> = []
      for (const cmd of finalCmd) {
        // data.exe
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
  const $ = runAsync



  /**
     *
     * Run a command in a separated process using child_process.fork.
     */
  const withContext = async(fn: () => void): Promise<number | null> => {
    const child = childProcess.fork(path.join(__dirname, '..', 'subprocess'), ['subprocess',])
    child.send({ fn: fn.toString(), })

    return new Promise((resolve, reject) => {
      child.on('close', (exitCode: any) => {
        resolve(exitCode)
      })
      child.on('error', (error: Error) => {
        reject(error)
      })
    })
  }
  /**
   *
   * Lists file and directories from current working directory.
   */
  const ls = () => {
    const stdout = fs.readdirSync(process.cwd())
    console.log(stdout)
    return stdout
  }

  const spawn = (...params: Parameters<typeof ChildProcess.spawn>) =>{
    return childProcess.spawn(...params)
  }
  const fork = (...params: Parameters<typeof ChildProcess.fork>) => {
    return childProcess.fork(...params)
  }

  return {
    $,
    run,
    runAsync,
    cd,
    exec,
    execAsync,
    fork,
    ls,
    spawn,
    withContext,
  }
}

export const {
  $,
  cd,
  exec,
  execAsync,
  fork,
  ls,
  run,
  runAsync,
  spawn,
  withContext,
} = defineShell(ChildProcess, Process, FS)
