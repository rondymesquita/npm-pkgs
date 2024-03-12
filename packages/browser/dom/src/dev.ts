/* eslint-disable new-cap */

import { a, button, createElement, div, h1, p } from '.'
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

const Counter = () => {
  // const { useState, } = dom()
  const [count, setCount, onCount,] = useState(5)
  const increment = () => {
    setCount(count() + 1)
  }

  const link = createElement('a', {
    href: '#/',
    target: '_blank',
  },  'my link')

  return div({
    title:'meu titulo',
    style: { color: 'red', },
  },
  link,
  a({ href: 'asd', }, 'custom link'),
  h1({ watch: [onCount,], }, 'Count ', count),
  button({ onclick: increment, }, 'increment'))
}
function DateComponent(){
  const { useState, } = dom()
  const [date, setDate, onDate,] = useState(new Date())

  setInterval(() => setDate(new Date()), 1000)

  return div(
    h1({ watch: [onDate,], }, 'Date', date)
  )
}

function App(){
  return div(
    Counter(),
    Counter(),
    DateComponent()
  )
}


mount(App, '#app')
//document.body.appendChild(Counter())
