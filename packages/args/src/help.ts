import cliui from 'cliui'
import {
  ArgsDefinition,
  ConfigModifier,
  defineArgs,
  Modifier,
  ModifierType,
  Option,
  ValidatorModifier,
} from '.'

const ui = cliui({} as any)

interface UiElement {
  text: string
  padding: Array<number>
}
interface OptionHelp {
  name: UiElement
  description: UiElement
  modifiers: UiElement
}

export const buildOptionHelp = (option: Option): OptionHelp => {
  const name = {
    text: `--${option.name}`,
    padding: [0],
  }

  const helpModifier = option.modifiers.find(
    (mod: Modifier) => mod.name === 'help',
  )

  const description = {
    text: helpModifier ? helpModifier.value : '',
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

  return { name, description, modifiers }
}

export const buildHelp = (
  definition: ArgsDefinition,
): {
  header: Array<UiElement>
  body: Array<OptionHelp>
} => {
  const header: Array<UiElement> = []
  const body: Array<OptionHelp> = []

  const name = definition.name ? definition.name : ''
  const usage = definition.usage ? definition.usage : ''

  name &&
    header.push({
      text: name,
      padding: [0],
    })
  usage &&
    header.push({
      text: `Usage: ${usage}`,
      padding: [0],
    })
  header.push({
    text: 'Options:',
    padding: [1],
  })

  definition.options.forEach((option: Option) => {
    body.push(buildOptionHelp(option))
  })
  return { header, body }
}

export const printHelp = (definition: ArgsDefinition) => {
  const { header, body } = buildHelp(definition)

  header.forEach((row: UiElement) => {
    ui.div(row)
  })

  body.forEach(({ name, description, modifiers }: OptionHelp) => {
    ui.div(name, description, modifiers)
  })
  console.log(ui.toString())
}
