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

interface ExportedClassMembers {
  [k: string]: Function
}

export const exportClassMembers = (instance: any): ExportedClassMembers => {
  const properties = Reflect.ownKeys(Object.getPrototypeOf(instance)).filter(
    (p) => p !== 'constructor',
  )

  const members: any = {}
  properties.forEach((prop) => {
    members[prop] = instance[prop].bind(instance)
  })

  return members
}
