

import { button, div, h1, p } from '.'

// const h1 = createElement('h1', {
//   title: 'meu titulo',
//   style: { color: 'red', },
// }, 'fulano')

function Card({
  color = 'gray',
  description = '',
  title = '',
}){
  return div(
    {
      style: {
        border: `1px solid ${color}`,
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '20px',
      },
    },
    h1(title),
    p(description)
  )
}

function useState <T = any>(defaultValue?: T): [
  () => T,
  (v: T) => void
] {
  let _value: T | undefined = defaultValue
  const value = (): T => {
    return _value as T
  }
  const setValue = (handlerOrNewValue: T): void => {
    _value = handlerOrNewValue
  }
  return [value, setValue,]
}

function Counter(){
  const [count, setCount,] = useState(0)
  const increment = (ev: MouseEvent) => {
    console.log(count())
    setCount(count() + 1)
    // console.log(count())
  }


  return div(
    { style: { padding: '10px', }, },
    div(`Counter ${count()}`),
    button({ onclick: increment, }, 'increment')
  )
}

function App(){
  return div(
    {
      title: ' ',
      style: { backgroundColor: '#eee', },
    },
    Counter(),
    Counter(),
    Card({
      title: 'My Card Name',
      description: 'Lorem Ipsum',
    })
  )
}

document.body.appendChild(App())
