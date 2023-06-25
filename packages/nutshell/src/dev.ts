import { tasks } from '.'
// import './globals'
// import { defineService } from './service'

// c.$('echo hello').then((r) => {
//   // console.log(r)
// })

// c.spawn
const service = new Service({
  name: 'fulano',
  command: 'echo 1',
})
tasks(service.toTasks())
