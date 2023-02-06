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
const { parseArgs } = defineArgs({
  options: [
    number('alpha', [required()]),
    string('beta', [defaultValue('beta')]),
    boolean('gamma', [help('Custom help message')]),
  ],
})

const argv = parseArgs(process.argv.splice(2))
```
