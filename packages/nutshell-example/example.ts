import { ls, run, tasks, withContext } from '@rondymesquita/nutshell'

const unit = async() => {
  await run`echo "Hello"`

  await run`
    echo "Multiline commands"
    echo "using template literals"
  `
  await withContext(async() => {
    await run`
      echo "I am running"
      echo "in a separated process"
    `
  })

  ls()

}

tasks({ default: unit, })
