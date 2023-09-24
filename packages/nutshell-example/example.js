const {
  file,
  ls,
  run,
  tasks,
  withContext,
} = require('@rondymesquita/nutshell')

// file('sicrano.json').touch()

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
