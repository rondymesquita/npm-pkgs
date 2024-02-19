#!/usr/bin/env -S tsx

/**
 * Enable type check
 */
import '@rondymesquita/nutshell/src/globals'

const unit = async() => {
  run`echo "Hello"`

  run`
    echo "Multiline commands"
    echo "using template literals"
  `
  await withContext(async() => {
    run`
      echo "I am running"
      echo "in a separated process"
    `
  })

  ls()

  file('rondy').content('').write()
}

tasks({ default: unit, })
