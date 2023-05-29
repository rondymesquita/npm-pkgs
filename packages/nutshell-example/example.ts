import { $, ls, setConfig, tasks, withContext } from '@rondymesquita/nutshell'

setConfig({
  loggerLevel: 'debug',
})

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
