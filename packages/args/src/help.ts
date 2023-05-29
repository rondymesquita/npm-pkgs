// @ts-ignore
import cliui from 'cliui'
import {
  ArgsDefinition,
  ConfigModifier,
  defineArgs,
  Modifier,
  ModifierType,
  ValidatorModifier,
} from '.'
import { Options } from './options'

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

export const buildHelpForOption = (
  optionName: string,
  optionModifiers: Modifier[],
): OptionHelp => {
  const helpModifier = optionModifiers.find(
    (mod: Modifier) => mod.name === 'help',
  )
  const typeModifier = optionModifiers.find(
    (mod: Modifier) => mod.name === 'type',
  )

  const name = {
    text: `--${optionName}`,
    padding: [0],
  }
  const description = {
    text: helpModifier ? helpModifier.value : '',
    padding: [0],
  }
  const modifiersArray = optionModifiers
    .filter(
      (modifier: Modifier) =>
        modifier.name !== 'help' && modifier.name !== 'type',
    )
    .map((modifier: Modifier) => {
      return `[${modifier.name}:${modifier.value}]`
    })

  if (typeModifier) {
    modifiersArray.unshift(`[${typeModifier.name}:${typeModifier.value}]`)
  }

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

  Object.entries(definition.options).forEach(([name, modifiers]) => {
    body.push(buildHelpForOption(name, modifiers))
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
