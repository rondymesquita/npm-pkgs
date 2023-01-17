import { help, showHelp } from './modifiers'
import { boolean } from './types'

export const helpOption = () => {
  return boolean('ajuda', [help('Show help message'), showHelp()])
}
