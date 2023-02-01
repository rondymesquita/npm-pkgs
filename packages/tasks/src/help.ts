import { Option, buildOptionHelp } from '@rondymesquita/args'
import cliui from 'cliui'
import { HelpMessage, HelpMessages, PlainTaskDefinition, Task } from '.'

const ui = cliui({} as any)

export const defineGlobalHelp = (
  definition: PlainTaskDefinition,
  messages: HelpMessages,
) => {
  const body: any = []
  const header: any = []

  // body.push({ name: 'Task', description: 'Help', options: 'Options' })

  Object.entries(messages).forEach(
    ([_, helpMessage]: [string, HelpMessage]) => {
      const name = {
        text: `${helpMessage.name}`,
        padding: [0],
      }
      const description = {
        text: `${helpMessage.description}`,
        padding: [0],
      }

      const options = helpMessage.argsDefinition.options
        .map((option: Option) => {
          return `[--${option.name}:${option.type}]`
        })
        .join(', ')

      body.push({ name, description, options })
    },
  )

  return { header, body }
}

export const defineTaskHelp = (name: string, messages: HelpMessages) => {
  const body: any = []
  const header: any = []

  // body.push({ name: 'Task', description: 'Help', options: 'Options' })

  const helpMessage = messages[name]

  helpMessage.argsDefinition.options.forEach((option: Option) => {
    body.push(buildOptionHelp(option))
  })

  return { header, body }
}

export const printGlobalHelp = (
  definition: PlainTaskDefinition,
  messages: HelpMessages,
) => {
  const { header, body } = defineGlobalHelp(definition, messages)

  body.forEach(({ name, description, options }: any) => {
    ui.div(name, description, options)
  })
  // console.log(ui.toString())
}
export const printTaskHelp = (
  task: Task,
  name: string,
  messages: HelpMessages,
) => {
  const { header, body } = defineTaskHelp(name, messages)

  body.forEach(({ name, description, modifiers }: any) => {
    ui.div(name, description, modifiers)
  })
  console.log(ui.toString())
}
