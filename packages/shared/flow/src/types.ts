export enum Status {
  OK = 'OK',
  FAIL = 'FAIL',
}

export interface Result {
  name: string
  status: Status
  data: any
}

export type Results = Array<Result>

export interface Option {
  stopOnError: boolean
}

export type ProvideArgsFn = (context: Context) => any[]

export type Context<K = any, V = any> = Map<K, V>
type SyncStage = (...params: any[]) => any
type AsyncStage = (...params: any[]) => Promise<any>

export type Stage = AsyncStage | SyncStage

export type StageName = string
export interface StageObject {
  [stageName: StageName]: Stage
}
export type StageMap = Map<StageName, Stage>

export type Stages = Array<Stage> | StageObject | StageMap
