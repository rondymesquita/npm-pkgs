export const isBoolean = (value: string) => {
  return ['true', 'false'].includes(value)
}

export const parseValue = (value: any) => {
  const quoted = new RegExp(/"(.*)"/)
  const res = quoted.exec(value)
  let vv = value

  const isQuoted = res && res.length > 0
  if (isQuoted) {
    vv = res[1]
  }

  if (isBoolean(vv)) {
    return vv === 'true'
  } else if (!vv) {
    return null
  } else if (vv === '0') {
    return 0
  } else if (!isNaN(vv)) {
    return Number(vv)
  } else {
    return vv
  }
}

export const parseDotenvFile = (fileContent: string): any => {
  const fileJSON: Record<string, any> = {}
  const lines = fileContent.split('\n')
  lines.forEach((line: string) => {
    const [key, value] = line.split('=')
    if (value) {
      fileJSON[key.trim()] = parseValue(value)
    }
  })

  return fileJSON
}
