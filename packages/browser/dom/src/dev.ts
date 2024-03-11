/* eslint-disable new-cap */

import { button, div, h1, p } from '.'
import { dom } from './dom/dom'
import { mount } from './dom/mount'
import { useState } from './dom/state'


function Card({
  color = 'gray',
  description = '',
  title = '',
}){

  const customTitle = () => h1({
    title: 'meu titulo',
    style: { color: 'red', },
  }, title)


  return div(
    {
      style: {
        border: `1px solid ${color}`,
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '20px',
      },
    },
    customTitle(),
    p(description)
  )
}


function Counter2(){
  const [count, setCount, onCount,] = useState(5)
  const increment = () => {
    setCount(count() + 1)
  }

  // const [time, setTime, onTime,] = useState(new Date().toTimeString())
  // setInterval(() => setTime(new Date().toTimeString()), 1000)

  // watch([onTime,], () =>{
  //   console.log('time updated', time())
  //   return div()
  // })

  return div(
    { style: { padding: '10px', }, },
    // watch([onCount,], () => div(`Reactive Counter ${JSON.stringify(count())}`)),
    div({ watch: [onCount,], }, `Reactive Counter ${JSON.stringify(count())}`),
    // watch([onTime,], () => div('Date ', time())),
    button({ onclick: increment, }, 'increment'),

    // watch([onTime,], () => count() % 2 === 0 ? h1('even') : h1('odd')),

    button({ onclick: () => setCount(count() - 1), }, 'decrement')
  )
}

const Counter = () => {
  const { useState, } = dom()
  const [count, setCount, onCount,] = useState(5)
  const increment = () => {
    setCount(count() + 1)
  }
  return div({
    title:'meu titulo',
    onclick: increment,
    style: { color: 'red', },
  },
  h1({ watch: [onCount,], }, 'Count ', count()),
  button({ onclick: increment, }, 'increment'))
}


mount(Counter, '#app')
//document.body.appendChild(Counter())
