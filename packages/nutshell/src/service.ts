import * as ChildProcess from 'child_process'
import * as FS from 'fs'
import * as Path from 'path'

const defineServiceFactory = () => {
  return defineService({
    fs: FS,
    path: Path,
    shell: ChildProcess,
  })
}

export const { service } = defineServiceFactory()

export interface ServiceInput {
  name: string
  cmd: string
  cwdLog?: string
  cwdPid?: string
}

interface DefineServiceInput {
  fs: {
    openSync: typeof FS.openSync
    mkdirSync: typeof FS.mkdirSync
    writeFileSync: typeof FS.writeFileSync
    readFileSync: typeof FS.readFileSync
    rmSync: typeof FS.rmSync
  }
  path: {
    resolve: typeof Path.resolve
  }
  shell: {
    spawn: typeof ChildProcess.spawn
  }
}

export function defineService({ fs, path, shell }: DefineServiceInput) {
  const service = (input: ServiceInput) => {
    const DEFAULT = {
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    }
    const { name, cmd, cwdLog, cwdPid } = Object.assign({}, input, DEFAULT)
    fs.mkdirSync(cwdPid, { recursive: true })
    const pidPath = path.resolve(cwdPid, `${name}.pid`)
    const out = fs.openSync(path.resolve(cwdLog, `${name}.log`), 'a')
    const err = fs.openSync(path.resolve(cwdLog, `${name}-err.log`), 'a')
    const start = () => {
      const ls = shell.spawn(cmd, {
        shell: 'bash',
        detached: true,
        stdio: ['ignore', out, err],
      })

      console.log(ls.pid)
      fs.writeFileSync(pidPath, String(ls.pid), { flag: 'w' })
      process.exit(0)
    }

    const stop = async () => {
      const pid = fs.readFileSync(pidPath).toString()
      await $(`kill -9 ${pid}`)
      fs.rmSync(pidPath, { force: true })
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
