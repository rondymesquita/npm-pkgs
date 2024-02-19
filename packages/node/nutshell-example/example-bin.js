#!/usr/bin/env nutshell

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
}

tasks({ unit, })
