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
  name: 'mycli',
  // options: [
  //   number('alpha', [help('A random value'), max(6), required(true)]),
  //   string('gama', [help('A sample help message')]),
  //   boolean('delta', []),
  //   boolean('help', [help('Show help message')]),
  // ],
  // options:
  options: ['alpha', 'beta', 'help'],
  // options: {
  //   alpha: [type('number'), help('A random value'), max(6), required(true)],
  // },
})

// const argv = args('--debug test:watch --alpha=alphavalue --beta'.split(' '))
const argv = parseArgs(process.argv.splice(2))
console.log(argv)
// console.log({ errors })

if (argv.errors.length > 0) {
  console.log(argv.errors)
  showErrors()
}

if (argv.options.help) {
  showHelp()
}
