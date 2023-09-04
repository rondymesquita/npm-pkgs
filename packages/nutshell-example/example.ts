import { $, withContext,ls, tasks } from '@rondymesquita/nutshell'
import { log } from 'console'

// const s = new Shell({ loggerLevel: 'debug', shell: 'bash' })

// setConfig({
//   loggerLevel: 'debug',
// })

log($)

const unit = async () => {
  await $`echo "Hello"`

  await $`
    echo "Multiline commands"
    echo "using template literals"
  `
  await withContext(async () => {
    await $`
      echo "I am running"
      echo "in a separated process"
    `
  })

  ls()
}

tasks({
  default: unit,
})
