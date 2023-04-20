export enum Status {
  OK = 'OK',
  FAIL = 'FAIL',
}

export interface Result {
  status: Status
  data: any
}

export type Results = Array<Result>

export interface Option {
  stopOnError?: boolean
  fulano?: boolean
}

export type Context = Map<any, any>
type SyncStage = (context: Context) => any
type AsyncStage = (context: Context) => Promise<any>
export type Stage = AsyncStage | SyncStage
