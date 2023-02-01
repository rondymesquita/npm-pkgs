import { help } from './modifiers'
import { boolean } from './types'

export const helpOption = () => {
  return boolean('help', [help('Show help message')])
}
