import { help, showHelp } from './modifiers'
import { boolean } from './types'

export const helpOption = (name = 'help', message = 'Show help message') => {
  return boolean(name, [help(message), showHelp()])
}
