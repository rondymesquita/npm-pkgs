import { Option, buildHelpForOption } from '@rondymesquita/args'
import cliui from 'cliui'
import { HelpMessage, HelpMessages, PlainTaskDefinition, Task } from '.'

const ui = cliui({} as any)

export const buildGlobalHelp = (messages: HelpMessages) => {
  const body: any = []
  const header: any = []

  header.push({
    text: 'Tasks:',
    padding: [1],
  })

  Object.entries(messages).forEach(
    ([helpMessageName, helpMessage]: [string, HelpMessage]) => {
      const name = {
        // text: `${helpMessage.name}`,
        text: helpMessageName,
        padding: [0],
      }
      const description = {
        text: helpMessage.description,
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

export const buildTaskHelp = (name: string, messages: HelpMessages) => {
  const body: any = []
  const header: any = []

  // body.push({ name: 'Task', description: 'Help', options: 'Options' })

  const helpMessage = messages[name]

  header.push({
    text: 'Task options:',
    padding: [1],
  })

  helpMessage.argsDefinition.options.forEach((option: Option) => {
    body.push(buildHelpForOption(option))
  })

  return { header, body }
}

export const showTasksHelp = (messages: HelpMessages) => {
  const { header, body } = buildGlobalHelp(messages)

  header.forEach((row: any) => {
    ui.div(row)
  })

  body.forEach(({ name, description, options }: any) => {
    ui.div(name, description, options)
  })
  console.log(ui.toString())
}
export const showTaskHelp = (
  task: Task,
  name: string,
  messages: HelpMessages,
) => {
  const { header, body } = buildTaskHelp(name, messages)

  header.forEach((row: any) => {
    ui.div(row)
  })

  body.forEach(({ name, description, modifiers }: any) => {
    ui.div(name, description, modifiers)
  })
  console.log(ui.toString())
}
