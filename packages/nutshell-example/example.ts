import { file, ls, run, tasks, withContext } from '@rondymesquita/nutshell'

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

  file('sicrano').content('').write()
}

tasks({ default: unit, })
