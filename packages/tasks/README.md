# tasks

Simple task runner

```js
async function clean() {
  await new Promise((res) => setTimeout(res, 2000))
}

function build() {
  console.log('building')
}

tasks({
  clean,
  build,
})


$ node tasks.js clean
$ node tasks.js build
```

### Help

```bash
$ node tasks.js --help
```

### Task args

```js
function build({ id, minify }) {
  console.log('building', )
}

tasks({
  build,
})


$ node tasks.js build --id=2 --minify=true
```

### Default tasks

Run a default task when no task name is informed.

```js
function build() {}

tasks({
  default: build,
})


$ node tasks.js --id=2
```

### Namespaces

```js
const test = {

  unit: ({ reporter }) => {
    console.log('running unit tests')
  },

  e2e: async () => {
    console.log('runnint e2e tests')
    await new Promise((res) => setTimeout(res, 2000))
  }
}

tasks({
  test,
})


$ node tasks.js test:unit --reporter=awesome-reporter
$ node tasks.js test:e2e

```

### Sequence

```js
async function clean() {
  await new Promise((res) => setTimeout(res, 2000))
}

function build() {
  console.log('building')
}

tasks({
  build: [clean, build],
})


$ node tasks.js build
```

### Context

Share data between tasks

```js
function jobid(options, ctx) {
  ctx.set('id', 12345)
}

async function clean(options, ctx) {
  console.log('cleaning', ctx.get('id'))
  await new Promise((res) => setTimeout(res, 2000))
}

function build(options, ctx) {
  console.log('building', ctx.get('id'))
}

tasks({
  build: [jobid, clean, build],
})


$ node tasks.js build
```
