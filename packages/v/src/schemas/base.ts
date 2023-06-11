export interface Validators {
  type: 'string'
  length?: number
}

export class BaseSchema {
  protected validators: Validators = { type: 'string' }
}

export interface Definition {
  [key: string]: BaseSchema
}
