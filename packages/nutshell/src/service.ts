import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import * as Path from 'path'

const defineServiceFactory = () => {
  return defineService({
    fs: FS,
    path: Path,
    childProcess: ChildProcess,
  })
}

export const { service } = defineServiceFactory()

export interface ServiceInput {
  name: string
  cmd: string
  cwdLog?: string
  cwdPid?: string
  shell?: string
}

export interface DefineServiceInput {
  fs: {
    openSync: typeof FS.openSync
    mkdirSync: typeof FS.mkdirSync
    writeFileSync: typeof FS.writeFileSync
    readFileSync: typeof FS.readFileSync
    rmSync: typeof FS.rmSync
    existsSync: typeof FS.existsSync
  }
  path: {
    resolve: typeof Path.resolve
  }
  childProcess: {
    spawn: typeof ChildProcess.spawn
    execSync: typeof ChildProcess.execSync
  }
}

export function defineService({ fs, path, childProcess }: DefineServiceInput) {
  const service = (input: ServiceInput) => {
    const DEFAULT = {
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    }

    const { name, cmd, cwdLog, cwdPid, shell }: ServiceInput = {
      ...input,
      ...DEFAULT,
    }

    fs.mkdirSync(cwdPid, { recursive: true })
    const pidPath = path.resolve(cwdPid, `${name}.pid`)
    const out = fs.openSync(path.resolve(cwdLog, `${name}.log`), 'a')
    const err = fs.openSync(path.resolve(cwdLog, `${name}-err.log`), 'a')

    const start = () => {
      const process = childProcess.spawn(cmd, {
        shell,
        detached: true,
        stdio: ['ignore', out, err],
      })

      fs.writeFileSync(pidPath, String(process.pid), { flag: 'w' })
    }

    const stop = () => {
      if (fs.existsSync(pidPath)) {
        const pid = fs.readFileSync(pidPath).toString()
        childProcess.execSync(`kill -9 ${pid}`)
        fs.rmSync(pidPath, { force: true })
      }
    }
    const restart = () => {
      stop()
      start()
    }
    return {
      start,
      stop,
      restart,
    }
  }

  return { service }
}
