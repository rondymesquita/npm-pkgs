# args

Simple argument parser.

```js
const argv = parseArgs(process.argv.splice(2))
// {
// 	options: {
// 		a: 0,
// 		alpha: 1,
// 		b: 0.5,
// 		beta: 1,
// 		d: true,
// 		delta: true,
// 		g: 'gama',
// 		gama: 'gama',
// 		e: false,
// 		epsilon: true,
// 	},
// 	params: [],
// 	errors: [],
// }
```

### Custom options

```js
const { parseArgs, showHelp } = defineArgs({
  options: [
    number('alpha', [required()]),
    string('beta', [defaultValue('beta')]),
    boolean('gamma', [help('Custom help message')]),
  ],
})

const argv = parseArgs(process.argv.splice(2))

if (argv.errors.length > 0) {
  showHelp()
}
```

### Help

```js
// Define help option
const { parseArgs, showHelp } = defineArgs({
  options: [boolean('help', [help('Show help message'), defaultValue(false)])],
})

// or user pre defined helpOption()
const { parseArgs, showHelp } = defineArgs({
  options: [helpOption()],
})

const argv = parseArgs(process.argv.splice(2))

if (argv.options.help) {
  showHelp()
}
```

### Parameters

```js
const argv = parseArgs('--alpha=alphavalue -b=false gamma delta'.split(' '))

// {
//   options: {
//     alpha: 'alphavalue',
//     b: false,
//   },
//   params: ['gamma', 'delta'],
//   errors: [],
// }
```

### Contraints

```js

// By type
number('alpha')
// errors: ['"alpha" must be of type "number"'],

// Required
boolean('beta', [required(true)]),
// errors: ['"beta" is required'],

```

#### User defined constrains

```js
const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})

const { parseArgs } = defineArgs({
  options: [number('gamma', [max(3)])],
})

const argv = parseArgs('--gamma=6'.split(' '))

// {
//   options: {
//     gamma: 6,
//   },
//   params: [],
//   errors: [
//     '"gamma" must satisfy "max" contraint. Expected:"3". Received:"6".',
//   ],
// }
```

Other examples

```js
// number validator
const lessThan = defineValidator('lessThan', (rule: number, value: number) => {
  return value < rule
})

lessThan(5)

// string validator
const length = defineValidator('length', (rule: number, value: string) => {
  return value.length <= rule
})

length(3)
```
