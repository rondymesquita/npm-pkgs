#!/usr/bin/env nutshell

// const { $ } = require("@rondymesquita/nutshell")
// require("@rondymesquita/nutshell")

;(async () => {
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
})()
