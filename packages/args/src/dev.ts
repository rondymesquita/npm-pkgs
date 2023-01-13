import {
  boolean,
  command,
  defineArgs,
  help,
  helpArgs,
  helpOption,
  number,
  param,
  required,
  string,
} from './index'

// param('test')

const parseArgs = defineArgs({
  // name: "",
  // params: [string('alpha', [required()]), boolean('debug')],
  // options: [number('id', [required(), max(5)])],
  options: [
    number('alpha', []),
    number('beta'),
    string('gama', [help('A sample help message'), required(false)]),
    boolean('delta', []),
    helpOption(),
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
