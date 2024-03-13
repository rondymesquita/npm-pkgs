/* eslint-disable new-cap */

import { button, div, h1 } from '.'
import { computed } from './dom/computed'
import { mount } from './dom/mount'
import { useState } from './dom/state'
import { watch } from './dom/watch'


function Card({
  children = [],
  color = 'gray',
  title = '',
}: any){

  const customTitle = () => h1({
    title,
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
    ...children
  )
}

const Counter = () => {
  const [count, setCount, onCount,] = useState(5)
  const increment = () => {
    setCount(count() + 1)
  }

  onCount('state:update', () => {
    console.log('opa')
  })

  const [date, setDate, onDate,] = useState(new Date())

  setInterval(() => setDate(new Date()), 1000)

  watch([onCount, onDate,], () => {
    console.log('ambos atualizados')
  })

  return div({
    title:'meu titulo',
    style: { color: 'red', },
  },

  h1({ watch: [onCount,], }, 'Count ', count),
  h1({ watch: [onDate,], }, 'Date is', () => date()),
  button({ onclick: increment, }, 'increment'))
}
function DateComponent(){
  const [date, setDate, onDate,] = useState(new Date())

  setInterval(() => setDate(new Date()), 1000)

  return div(
    h1({ watch: [onDate,], }, 'Date', date)
  )
}

function User(){
  const [name, setName, onName,] = useState('rondy')
  const [surname, setSurname, onSurname,] = useState('mesquita')

  const [fullname, _, onFullname,] = computed([onName, onSurname,], () => {
    return name() + ' ' + surname()
  })

  // const fullname = () => {
  //   return name() + ' ' + surname()
  // }

  setTimeout(() => {
    setName('fulano')
    setSurname('de tal')
  }, 1000)

  return div(
    div('name is: ', name),
    div('full name is: ', fullname),
    div({ watch:[onFullname,], }, 'full name is: ', fullname)
  )
}

function App(){
  return div(
    // Card({ children: [Counter(),], })
    User()
  )
}


mount(App, '#app')
