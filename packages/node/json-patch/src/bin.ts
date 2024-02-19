import { type, defineArgs } from '@rondymesquita/args'
import { definePatcher } from '.'

const { parseArgs, showErrors, showHelp } = defineArgs({
  name: 'json-path [options]',
  options: {
    patchFile: [type('string')],
    outputFile: [type('string')],
  },
})

const argv = parseArgs(process.argv.splice(2))

if (argv.options.help) {
  showHelp()
  process.exit(0)
}

if (argv.errors.length > 0) {
  showErrors()
  process.exit(1)
}

const { patch } = definePatcher({
  cwd: process.cwd(),
  patchFile: argv.options.patchFile,
  outputFile: argv.options.outputFile,
  indent: 2,
})

patch()

// ;(async () => {
//   patch()
//   await new Promise((res) => setTimeout(res, 2000))
//   reset()
// })()
