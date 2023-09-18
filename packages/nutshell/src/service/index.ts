export interface ServiceOptions {
  name: string
  command: string
  cwdLog?: string
  cwdPid?: string
  shell?: string
}

export interface ServiceSettings {
  pidPath: string
  outLog: number
  errLog: number
}
export * from './service'
