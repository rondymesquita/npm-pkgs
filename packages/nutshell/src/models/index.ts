export interface Options {
  shell: 'bash' | 'powershell' | 'cmd' | 'sh' | string

  /**
   * Sets log level.
   *
   * - none: Disable logs.
   * - error: Logs only when errors occur.
   * - info: Logs only the outputs of the commands.
   * - verbose: Logs the commands being executed.
   * - debug: Logs extra information for helping with debugs.
   */
  loggerLevel: 'none' | 'error' | 'info' | 'verbose' | 'debug'
}

export interface CmdResult {
  stdout: string | Buffer
  stderr: string | Buffer
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T


export interface IFile<T extends string | any> {
  read: () => T
  write: (content?: T) => void
}

export interface IFileString extends IFile<string>{
  replace: (searchValue: string | RegExp, replaceValue: string) => void
}
