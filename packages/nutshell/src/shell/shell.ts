import * as ChildProcess from 'child_process'
import { sync } from 'fast-glob'
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

  return {
    cd(dir: string) {
      console.log('cd', dir)
      process.chdir(dir)
    },
    exec(...params: Parameters<typeof ChildProcess.execSync>){
      const stringOrBuffer = childProcess.execSync(...params)
      let res = stringOrBuffer
      if (stringOrBuffer instanceof Buffer) {
        res = stringOrBuffer.toString('utf8')
      }
      return res

    },
    execAsync(...params: Parameters<typeof ChildProcess.exec.__promisify__>){
      return promisify(childProcess.exec)(...params)
    },
    run(cmd: string | Array<string> | TemplateStringsArray): string | string[] {
      const finalCmd = prepareCommand(cmd)

      if (Array.isArray(finalCmd)) {
        const results: Array<string> = []
        for (const cmd of finalCmd) {
          const result = this.exec(cmd)
          console.log(result)
          results.push(result.toString())
        }
        return results
      } else {

        const result = this.exec(finalCmd)
        console.log(result)
        return result.toString()
      }
    },
    async runAsync(cmd: string | Array<string> | TemplateStringsArray): Promise<CmdResult | CmdResult[]> {
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
    },
    copy(source: string, destination: string){

      const { base, ext, } = path.parse(destination)
      const isFileDestination = !!base && !!ext

      const sourcePaths = sync(source)
      sourcePaths.map((sourcePath: string) => {

        // convert relative path to absolute
        const isDestinationRelative = !path.isAbsolute(destination)
        const destinationPath = isDestinationRelative ? path.join(process.cwd(), destination) : destination

        const {
          base: baseSrc,
          dir: dirSrc,
          ext: extSrc,
          root: rootSrc,
        } = path.parse(sourcePath)
        const isFileSource = !!baseSrc && !!extSrc

        if(isFileSource && isFileDestination) {
          fs.copyFileSync(sourcePath, destinationPath)
        } else if (isFileSource && !isFileDestination) {
          const fileName = baseSrc

          const completeDestinationPath = path.join(destinationPath, fileName)
          // console.log({
          //   isFileSource,
          //   isFileDestination,
          //   destination,
          //   destinationPath,
          //   baseSrc,
          //   dirSrc,
          //   extSrc,
          //   rootSrc,
          //   sourcePath,
          //   fileName,
          //   completeDestinationPath,
          // });
          fs.copyFileSync(sourcePath, completeDestinationPath)
        }
      })

    },
    async withContext(fn: () => void): Promise<number | null> {
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
    },
    ls() {
      const stdout = fs.readdirSync(process.cwd())
      console.log(stdout)
      return stdout
    },

    spawn(...params: Parameters<typeof ChildProcess.spawn>){
      return childProcess.spawn(...params)
    },
    fork(...params: Parameters<typeof ChildProcess.fork>) {
      return childProcess.fork(...params)
    },
  }

  // return {
  //   $,
  //   run,
  //   runAsync,
  //   cd,
  //   exec,
  //   execAsync,
  //   fork,
  //   ls,
  //   spawn,
  //   withContext,
  // }
}
