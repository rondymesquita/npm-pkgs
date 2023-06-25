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
export interface IService {
  start(): void
  stop(): void
  restart(): void
}

export * from './service.api'
