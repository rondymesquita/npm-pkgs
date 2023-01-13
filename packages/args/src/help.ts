import cliui from 'cliui'
import { ArgsDefinition, Modifier } from '.'

const ui = cliui({} as any)

export const showHelp = (definition: ArgsDefinition) => {
  // console.log('Options')
  ui.div('Usage: $0 [options]')
  ui.div({
    text: 'Options:',
    padding: [1],
  })

  definition.options.forEach((option) => {
    const paramName = {
      text: `--${option.name}`,
      padding: [0],
    }

    const helpModifier = option.modifiers.find(
      (mod: Modifier) => mod.name === 'help',
    )
    const helpText = helpModifier ? helpModifier.value : ''
    const helpMessage = {
      text: helpText,
      padding: [0],
    }

    const modifiersArray = option.modifiers
      .filter((modifier: Modifier) => modifier.name !== 'help')
      .map((modifier: Modifier) => `[${modifier.name}:${modifier.value}]`)
    modifiersArray.unshift(`[${option.type}]`)
    const modifiers = {
      text: modifiersArray.join(', '),
      padding: [0],
    }
    ui.div(paramName, helpMessage, modifiers)
  })

  console.log(ui.toString())
}
