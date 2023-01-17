import cliui from 'cliui'
import {
  ArgsDefinition,
  ConfigModifier,
  defineArgs,
  Modifier,
  ModifierType,
  ValidatorModifier,
} from '.'

const ui = cliui({} as any)

export const defineHelp = (definition: ArgsDefinition) => {
  const helpMessage: any = []

  definition.options.forEach((option) => {
    const name = {
      text: `--${option.name}`,
      padding: [0],
    }

    const helpModifier = option.modifiers.find(
      (mod: Modifier) => mod.name === 'help',
    )
    const helpText = helpModifier ? helpModifier.value : ''
    const message = {
      text: helpText,
      padding: [0],
    }

    const modifiersArray = option.modifiers
      .filter(
        (modifier: Modifier) =>
          modifier.name !== 'help' && modifier.name !== 'showhelp',
      )
      .map((modifier: Modifier) => {
        return `[${modifier.name}:${modifier.value}]`
      })
    modifiersArray.unshift(`[${option.type}]`)
    const modifiers = {
      text: modifiersArray.join(', '),
      padding: [0],
    }

    helpMessage.push({ name, message, modifiers })
  })
  return helpMessage
}

export const printHelp = (definition: ArgsDefinition) => {
  const helpMessage = defineHelp(definition)
  ui.div('Usage: $0 [options]')
  ui.div({
    text: 'Options:',
    padding: [1],
  })

  helpMessage.forEach(({ name, message, modifiers }: any) => {
    ui.div(name, message, modifiers)
  })
  console.log(ui.toString())
}
