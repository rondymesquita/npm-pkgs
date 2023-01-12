export const parseModifiers = (modifiers: any[]) => {
  const options: any = {}
  Object.entries(modifiers).forEach(([_, modifier]) => {
    const key = Object.entries(modifier)[0][0]
    const value = Object.entries(modifier)[0][1]
    options[key] = value
  })

  return options
}

export const isBoolean = (value: string) => {
  return ['true', 'false'].includes(value)
}

export const parseValue = (value: any) => {
  if (isBoolean(value)) {
    return value === 'true'
  } else if (!value) {
    return true
  } else if (value === '0') {
    return 0
  } else {
    return Number(value) || value
  }
}
