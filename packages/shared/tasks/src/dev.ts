import { Context, tasks } from './index'

function jobid(options: any, ctx: Context) {
  ctx.set('id', 12345)
}

async function clean(options: any, ctx: Context) {
  console.log('cleaning', ctx.get('id'))
  await new Promise((res) => setTimeout(res, 2000))
}

function build(options: any, ctx: Context) {
  console.log('building', ctx.get('id'))
}

tasks({
  build: [jobid, clean, build],
})
