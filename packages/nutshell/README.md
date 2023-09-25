# Nutshell

Write better shell scripts using NodeJS

<div align="center"><img src="https://img.icons8.com/plasticine/100/1A1A1A/nutshell.png"/></div>
<h2 align="center">Nutshell</h2>
<h4 align="center">Node Useful Tool for Shell</h4>
<br>

Create a `example.js`

```ts
#!/usr/bin/env nutshell

;(async () => {
  run`echo "Hello"`

  run`
    echo "Multiline commands"
    echo "using template literals"
  `
  await withContext(() => {
    run`
      echo "I am running"
      echo "in a separated process"
    `
  })
})()
```

Run:

```bash
./example.js
```

### Require
```js
const {
  ls,
  run,
  withContext,
} = require('@rondymesquita/nutshell')

;(async () => {
  run`echo "Hello"`

  await withContext(() => {
    ls()
  })
})()
```

Run:

```bash
node example.js
```

## Using Typescript

For usage with Typescript, change intepreter to any typescript interpreter like `tsx` or `ts-node`.

https://github.com/esbuild-kit/tsx
https://www.npmjs.com/package/ts-node


```ts
#!/usr/bin/env tsx

// import to enable type checking
import '@rondymesquita/nutshell/src/globals'

;(async () => {
  run`echo "Hello"`

  run`
    echo "Multiline commands"
    echo "using template literals"
  `
  await withContext(() => {
    run`
      echo "I am running"
      echo "in a separated process"
    `
  })
})()
```

```bash
./example.ts
```

### Import
```ts
import { ls, run, withContext } from '@rondymesquita/nutshell'

;(async () => {
  run`echo "Hello"`

  await withContext(() => {
    ls()
  })
})()
```

Run:

```bash
tsx example.ts
```

## Using with tasks

[@rondymesquita/tasks](../tasks//README.md)

```ts
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
```

```bash
$ node file.js unit
```

## Configuration

Set custom configuration with `setConfig`

TBD

## Configuration options

TBD

## API

TBD

### Motivation

Sometimes, writing shell scripts can be challenging, specially when we need to do conditionals, loops, reading files like JSON or YAML. Nutshell helps in these cases leveraging the knowledge in Javascript without being too far of Shell Scripts.

<br>

Logo By [icons8](https://icons8.com/icon/yF1Jnxh1CN0X/nutshell)

Inspired by [Google zx](https://github.com/google/zx), but using libraries I personaly prefer.
