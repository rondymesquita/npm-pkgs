export enum Status {
  OK = 'OK',
  FAIL = 'FAIL',
}

export interface Result {
  status: Status
  data: any
}

export interface Option {
  stopOnError?: boolean
  fulano?: boolean
}

export type Stage = () => any
