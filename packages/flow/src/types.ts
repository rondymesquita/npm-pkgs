export enum Status {
  OK = 'OK',
  FAIL = 'FAIL',
}

export interface Result {
  status: Status
  result: any
}

export type Stage = () => any
