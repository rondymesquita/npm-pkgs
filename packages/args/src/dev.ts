import {
  boolean,
  defineArgs,
  defineValidator,
  help,
  // help,
  // helpOption,
  number,
  showHelp,
  // required,
  // showHelp,
  string,
  ValidatorModifier,
} from './index'

// param('test')

// const max2 = (rule: number) => ({
//   name: 'max',
//   rule,
//   validate: (rule: number, value: number) => {
//     return value <= rule
//   },
// })

// const max = (rule: number) => {
//   return (value: number) => {
//     return value >= rule
//   }
// }

const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})
const parseArgs = defineArgs({
  // name: "",
  // params: [string('alpha', [required()]), boolean('debug')],
  // options: [number('id', [required(), max(5)])],
  options: [
    number('alpha', [help('A random value'), max(6)]),
    // number('beta', []),
    // string('gama', [help('A sample help message')]),
    // boolean('delta', []),
    boolean('ajuda', [help('Show help message'), showHelp()]),
    // boolean('ajuda', [help('Show help message')]),
    // helpOption(),
  ],
  // commands: [command('hello', {}), command('bye', {})],
  // command: command('hello', {s
  //   params: [number('name', [required(), max(5)])],
  // }),
  // commands: {...command("hello"), ...param()}
})

// helpArgs()

// const argv = args('--debug test:watch --alpha=alphavalue --beta'.split(' '))
const argv = parseArgs(process.argv.splice(2))
// console.log(argv)
