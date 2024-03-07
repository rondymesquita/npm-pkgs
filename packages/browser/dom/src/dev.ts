

import { button, div, h1, p } from '.'
import { defineBus } from './bus'


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

type State<T> = {
  value: T
}
function useState <T>(defaultValue?: T): [
  () => T,
  (v: T) => void,
  any
  //State<T>
] {
  // const isObject = typeof defaultValue === 'object' && !Array.isArray(defaultValue)
  const model = { value: defaultValue, }

  const { emit, on, } = defineBus()


  let onStateChange: (...args: any[]) => void;

  const state = new Proxy(model as any, {
    set: function(target: any, prop: any, value: any) {
      console.log('state changed')
      //if (onStateChange){
      //  onStateChange()
      //}
      setTimeout(() => emit('fulano'))
      //emit('fulano')
      return target[prop] = value;
    },
  });
  const getValue = (): T => {
    return state.value
  }
  const setValue = (handlerOrNewValue: T): void => {
    state.value = handlerOrNewValue
  }
  const watcher = (handler: (...args: any[]) => void) => {
    onStateChange = handler
  }
  return [getValue, setValue, on,]
}


function watch<T = any>(deps: any[]
  , renderHTMLElement: () => HTMLElement): HTMLElement {
  console.log(deps)
  const wrapper = document.createElement('div')
  const handler = () => {
    console.log('called here')
    const element = renderHTMLElement()
    wrapper.replaceChildren(element)
  }
  deps.forEach(on => {
    on('fulano', handler)
  })
  const element = renderHTMLElement()
  wrapper.replaceChildren(element)
  return wrapper
}

function Counter(){
  const [count, setCount, onCount,] = useState(5)
  const increment = () => {
    setCount(count() + 1)
  }

  return div(
    { style: { padding: '10px', }, },
    watch([onCount,], () => div(`Reactive Counter ${JSON.stringify(count())}`)),
    div(`Non Reactive Counter ${JSON.stringify(count())}`),
    div(`Date ${new Date().toTimeString()}`),
    button({ onclick: increment, }, 'increment')
  )
}

function App(){
  return div(
    { style: { backgroundColor: '#eee', }, },
    Counter(),
    Counter(),
    Card({
      title: 'My Card Name',
      description: 'Lorem Ipsum',
    })
  )
}

document.body.appendChild(App())
