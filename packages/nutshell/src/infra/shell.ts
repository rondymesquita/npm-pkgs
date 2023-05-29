import { promisify } from 'util'
import { exec as nodeExec } from 'child_process'
import { CmdResult } from '../models'

const execAsync = promisify(nodeExec)

export interface Shell {
  exec(cmd: string): Promise<CmdResult>
}

export const exec = async (cmd: string) => {
  // return await execAsync(cmd, {
  //   shell: 'bash',
  // })
  return await execAsync(cmd)
}
