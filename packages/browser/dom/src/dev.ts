import * as lib from './main';

const jsonMl = lib.domToJSONML(document.querySelector('#app')!)
console.log('jsonMl', jsonMl)
