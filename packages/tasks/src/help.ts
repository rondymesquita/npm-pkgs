import { ArgsDefinition, Modifier } from '@rondymesquita/args'
// @ts-ignore
import cliui from 'cliui'
import { TasksDefinition } from '.'

const ui = cliui({} as any)

export interface HelpMessage {
  name: string
  description: string
  argsDefinition: ArgsDefinition
}

export type HelpMessages = {
  [key: string]: HelpMessage
}

export const buildGlobalHelp = (definition: TasksDefinition) => {
  const header: any = []
  const body: any = []

  header.push({
    text: 'Tasks:',
    padding: [1],
  })

  Object.entries(definition).forEach(([taskName, taskMeta]) => {
    const name = {
      text: taskName,
      padding: [0],
    }
    const description = {
      text: taskMeta.description,
      padding: [0],
    }
    body.push({ name, description })
  })

  return { header, body }
}

export const showGlobalHelp = (definition: TasksDefinition) => {
  const { header, body } = buildGlobalHelp(definition)

  header.forEach((row: any) => {
    ui.div(row)
  })

  body.forEach(({ name, description }: any) => {
    ui.div(name, description)
  })
  console.log(ui.toString())
}
