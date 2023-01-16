import cliui from 'cliui'
import { ArgsDefinition, ConfigModifier, Modifier } from '.'

const ui = cliui({} as any)

export const printHelp = (definition: ArgsDefinition) => {
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
      .filter(
        (modifier: Modifier) =>
          modifier.name !== 'help' && modifier.name !== 'showhelp',
      )
      .map((modifier: Modifier) => {
        const description = 'value' in modifier ? modifier.value : modifier.rule
        return `[${modifier.name}:${description}]`
      })
    modifiersArray.unshift(`[${option.type}]`)
    const modifiers = {
      text: modifiersArray.join(', '),
      padding: [0],
    }
    ui.div(paramName, helpMessage, modifiers)
  })

  console.log(ui.toString())
  return ui.toString()
}
