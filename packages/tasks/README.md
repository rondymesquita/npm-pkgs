# tasks

Simple task runner

```js
function build(ctx) {
  console.log('building', ctx)
}

async function clean(ctx) {
  console.log('cleaning', ctx)
  await new Promise((res) => setTimeout(res, 2000))
}

tasks({
  build,
  clean,
})

// $ node tasks.js clean
// $ node tasks.js build
```

### Help

```bash
node tasks.js --help
```

### Task help

```js
help(build, 'build app')
function build() {}

tasks({
  build,
})

// $ node tasks.js build --help
```

### Task args

```js
args(build, { options: [number('id', [max(3)])] })
function build(ctx) {
  console.log('building', ctx._.argv)
}

tasks({
  build,
})

// $ node tasks.js build --id=2
```

### Default tasks

```js
args(build, { options: [number('id', [max(3)])] })
function build(ctx) {}

tasks({
  default: build,
})

// $ node tasks.js --id=2
```

### Namespaces

```js
const test = namespace('test', ({ tasks, args }) => {
  args(unit, {
    options: [
      string('reporter', [help('Reporter format'), required()]),
      helpOption('help', 'run unit tests'),
    ],
  })
  function unit(ctx: Context) {
    console.log('running unit tests', ctx)
  }

  async function e2e(ctx: Context) {
    console.log('runnint e2e tests', ctx)
    await new Promise((res) => setTimeout(res, 2000))
  }

  return tasks({ default: unit, e2e, unit })
})

tasks({
  ...test,
})

// $ node tasks.js test:unit --reporter=awesome-reporter
// $ node tasks.js test:e2e
// $ node tasks.js test
```
