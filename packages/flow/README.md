# flow

Simple execute functions in sequence.

- Easy exception handling
- Improve code readability

```js
const run = flow([() => 1, () => 2])

const results = run()
// [
// 	{
// 		data: 1,
// 		status: 'OK',
// 	},
// 	{
// 		data: 2,
// 		status: 'OK',
// 	},
// ]
```

### Stop execution

Simply make stage thrown an exception.

```js
const run = flow([
  () => {
    throw new Error('sample error')
  },
  () => {
    return 'This stage will no be executed'
  },
])

const results = run()
// [
//   {
//     data: 'sample error',
//     status: 'FAIL',
//   }
// ]
```

### Keep executing even with exception

Pass options to `run` function.

```js
const run = flow([
  () => {
    throw new Error('error')
  },
  () => 'this will be executed normally',
])

const results = run([stopOnError(false)])
// {
//   data: 'error',
//   status: 'FAIL',
// },
// {
//   data: 'this will be executed normally',
//   status: 'OK',
// },
```

### Get all sucesses or errors

```js
const run = flow([
  () => {
    throw new Error('error')
  },
  () => 'this will be executed normally',
])

const results = run([stopOnError(false)])

const successes = results.filter((result) => result.status === Status.OK)
const errors = results.filter((result) => result.status === Status.FAIL)
```
