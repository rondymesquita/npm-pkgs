import args from './index'
const argv = args('--debug test:watch --alpha=alphavalue --beta'.split(' '))
console.log(argv)
