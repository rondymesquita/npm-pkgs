export const prepareCommand = (
  cmd: string | Array<string> | TemplateStringsArray,
): string | string[] => {
  let finalCmd: string | Array<string>
  if (typeof cmd === 'object') {
    finalCmd = cmd[0]
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c)
  } else {
    finalCmd = cmd.trim()
  }

  return finalCmd
}

type ExportedClassMembers<T> = {
  [k in keyof T]: Function
}

export const exportClassMembers = <T>(
  instance: any,
): ExportedClassMembers<T> => {
  const properties = Reflect.ownKeys(Object.getPrototypeOf(instance)).filter(
    (p) => p !== 'constructor',
  )
  console.log(properties)

  const members: any = {}
  properties.forEach((prop) => {
    members[prop] = instance[prop].bind(instance)
  })

  return members
}
