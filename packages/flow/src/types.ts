export enum Status {
  OK = 'OK',
  FAIL = 'FAIL',
}

export interface Result {
  status: Status
  data: any
}

export type Stage = () => any
