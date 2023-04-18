import {
  boolean,
  defaultValue,
  defineArgs,
  defineValidator,
  help,
  number,
  required,
  string,
} from './index'

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})
const { parseArgs, showHelp } = defineArgs({
  name: 'mycli',
  // params: [string('alpha', [required()]), boolean('debug')],
  options: [
    number('alpha', [help('A random value'), max(6), required(true)]),
    string('gama', [help('A sample help message')]),
    boolean('delta', []),
    boolean('help', [help('Show help message'), defaultValue(true)]),
  ],
  // commands: [command('hello', {}), command('bye', {})],
  // command: command('hello', {s
  //   params: [number('name', [required(), max(5)])],
  // }),
  // commands: {...command("hello"), ...param()}
})

// showHelp()

// const argv = args('--debug test:watch --alpha=alphavalue --beta'.split(' '))
const argv = parseArgs(process.argv.splice(2))
console.log(argv)

if (argv.options.help) {
  showHelp()
}
