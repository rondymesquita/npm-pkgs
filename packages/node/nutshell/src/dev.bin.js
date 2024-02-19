#!/usr/bin/env nutshell
// #!/usr/bin/env -S tsx -r @rondymesquita/nutshell/bin

(async() => {
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
})()
