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

type SyncStage = () => any
type AsyncStage = () => Promise<any>
export type Stage = AsyncStage | SyncStage
