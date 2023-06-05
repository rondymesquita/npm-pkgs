interface ExportedClassMembers {
  [k: string]: Function
}

export const exportClassMembers = <T = ExportedClassMembers>(
  instance: any,
): T => {
  const properties = Reflect.ownKeys(Object.getPrototypeOf(instance)).filter(
    (p) => p !== 'constructor',
  )

  const module: any = {}
  properties.forEach((prop) => {
    module[prop] = instance[prop].bind(instance)
  })

  return module
}

const defaults = <T = any>(object: T | undefined, defaultValues: any) => {
  const values: Record<string, any> = {}
  Object.entries(defaultValues).forEach(([key, value]) => {
    if ((object as any)[key]) {
      values[key] = (object as any)[key]
    } else {
      values[key] = value
    }
  })

  return values as Required<T>
}
