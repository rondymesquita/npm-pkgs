if (process.argv[2] !== 'subprocess') {
  console.log('Use "child_process.fork"')
  process.exit(0)
}

import * as import_nutshell from './'
import_nutshell
import './globals'

process.on('message', async (message: any) => {
  const fn = eval(message.fn)
  await fn()
  process.exit()
})
