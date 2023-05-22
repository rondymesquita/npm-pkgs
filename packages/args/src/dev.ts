import {
  // boolean,
  defaultValue,
  defineArgs,
  defineValidator,
  help,
  // help,
  // number,
  required,
  // string,
  type,
} from './index'

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})
const { parseArgs, showHelp, showErrors } = defineArgs({
  name: 'cli',
  usage: 'cli [options]',
  options: {
    alpha: [type('number'), required()],
    beta: [type('string'), defaultValue('value')],
    gamma: [type('boolean'), help('Custom help message')],
  },
})

// const argv = args('--debug test:watch --alpha=alphavalue --beta'.split(' '))
const argv = parseArgs(process.argv.splice(2))

if (argv.errors.length > 0) {
  showErrors()
  process.exit(0)
}

if (argv.options.help) {
  showHelp()
}
