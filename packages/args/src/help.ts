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

  console.log(definition)
  const options = []
  definition.options.forEach((option) => {
    console.log(option)
    const paramName = {
      text: `--${option.name}`,
      padding: [0],
    }

    const helpModifier = option.modifiers.find(
      (mod: Modifier<string>) => mod.name === 'help',
    )
    const helpText = helpModifier ? helpModifier.value : ''
    const helpMessage = {
      text: helpText,
      padding: [0],
    }
    const modifiers = {
      text: option.modifiers
        .filter((modifier: Modifier<any>) => modifier.name !== 'help')
        .map(
          (modifier: Modifier<any>) => `[${modifier.name}:${modifier.value}]`,
        )
        .join(', '),
      padding: [0],
    }
    ui.div(paramName, helpMessage, modifiers)
    // ui.div()
  })

  console.log(ui.toString())
  // console.log(definition.options)
}
