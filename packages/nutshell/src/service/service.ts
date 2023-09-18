import * as ChildProcess from 'child_process'
import { log } from 'console'
import * as Crypto from 'crypto'
import * as FS from 'fs'
import * as Path from 'path'
import * as Process from 'process'

import { ServiceOptions } from '.'


const isWin = process.platform == 'win32'

export const defineService = (
  childProcess: typeof ChildProcess,
  path: typeof Path,
  fs: typeof FS,
  process: typeof Process
) => {

  const DEFAULT_OPTIONS = {
    cwdLog: process.cwd(),
    cwdPid: process.cwd(),
    name: Crypto.randomUUID(),
  }
  let options = Object.assign({}, DEFAULT_OPTIONS)

  const service = (_options:ServiceOptions) => {
    options = Object.assign(options, _options)

    const { name, cwdLog, cwdPid, } = options
    fs.mkdirSync(cwdPid, { recursive: true, })
    const pidPath = path.resolve(cwdPid, `${name}.pid`)
    const pidPath2 = path.resolve(cwdPid, `${name}-2.pid`)
    const outLog = fs.openSync(path.resolve(cwdLog, `${name}.log`), 'a')
    const errLog = fs.openSync(path.resolve(cwdLog, `${name}-err.log`), 'a')

    log({ cwdPid, cwdLog, isWin, })

    const state = {
      start() {

        const { command, } = options as Required<ServiceOptions>
        // const shell = isWin ? true : true
        // const flag = isWin ? '/c' : '-c'

        const file = childProcess.spawn(command, {
          cwd: process.cwd(),
          env: process.env,
          shell: true,
          detached: true,
          windowsHide: true,
          stdio: [
            process.stdin,
            outLog,
            errLog,
          ],
        })
        // file.stderr.buffer
        // file.stderr.pipe(process.stderr)
        // log({ file, })

        log({ command, })
        log({ filePid: file.pid, processPid: process.pid, })

        fs.writeFileSync(
          pidPath, String(file.pid), { flag: 'w', }
        )
        file.unref()
      },

      stop() {
        if (fs.existsSync(pidPath)) {
          const pid = Number(fs.readFileSync(pidPath).toString())
          childProcess.execSync(`taskkill /pid ${pid} /T /F`)
          // fs.rmSync(pidPath, { force: true, })
        }
      },
      restart() {
        this.stop()
        this.start()
      },
    }
    return state
  }

  return service

}


export const service = defineService(ChildProcess, Path, FS, Process)
