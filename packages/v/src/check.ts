import { Validators } from './schemas'

export const checkType = (ctx: Map<string, any>) => {
  const { validators, value }: { validators: Validators; value: any } = ctx.get(
    'meta',
  )
  if (!validators.type) {
    return
  }

  if (validators.type !== typeof value) {
    throw new Error('type')
  }
}

export const checkLength = (ctx: Map<string, any>) => {
  const { validators, value }: { validators: Validators; value: any } = ctx.get(
    'meta',
  )

  if (!validators.length) {
    return
  }

  if (value.length > validators.length) {
    throw new Error('length')
  }
}
