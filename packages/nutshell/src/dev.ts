// import { service,
//   tasks } from '.'

import { copy,  file,  ls } from './';


// const xvfb = service({ name: '123', command: 'serve -l 1234 .', })

// tasks(xvfb)

// run('echo hello')
ls()
copy('./typedoc.json', './')
// run()
// file('fulano.json').write()
const data = file('fulano.json').read()
console.log({ data, });
