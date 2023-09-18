if (process.argv[2] !== 'subprocess') {
  console.log('Use "child_process.fork"')
  process.exit(0)
}

// eslint-disable-next-line
import * as import__ from './shell'
// shell
import './globals'
// console.log(global)

// import__.ls()


process.on('message', async (message: any) => {
  const fn = eval(message.fn)
  await fn()
  process.exit()
})
