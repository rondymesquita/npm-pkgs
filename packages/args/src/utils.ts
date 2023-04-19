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
