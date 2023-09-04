import { $, withContext, cd, ls, tasks } from '.'
// import './globals'
// import { defineService } from './service'

// c.$('echo hello').then((r) => {
//   // console.log(r)
// })

// c.spawn
// const service = new Service({
//   name: 'fulano',
//   command: 'echo 1',
// })

// const shell = new Shell()
// cd()
// cd()
// tasks(service.toTasks())


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
  start: unit
})
