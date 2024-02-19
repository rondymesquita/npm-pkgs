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
// 	params: []
// }
```

### Custom options

```js
const { parseArgs, showHelp } = defineArgs({
  name: 'mycli',
  usage: 'mycli [options]',
  options: {
    alpha: [type('number'), required()],
    beta: [type('string'), defaultValue('value')],
    gamma: [type('boolean'), help('Custom help message')],
  },
})
```

### Help

```js
// define help option
const { parseArgs, showHelp, errors } = defineArgs({
  options: {
    help: [help('Show help message'), type('boolean'), defaultValue(false)],
  },
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
//   params: ['gamma', 'delta']
// }
```

### Modifiers

```js

// By type
alpha: [type('string')]
// errors: ['"alpha" must be of type "number"'],

// Required
beta: [required()],
// errors: ['"beta" is required'],

```

#### User defined modifier

```js
const max = defineValidator('max', (rule: number, value: number) => {
  return value <= rule
})

const { parseArgs } = defineArgs({
  options: {
    gamma: [max(3)],
  },
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
