import { createElement } from '.';

// const h1 = createElement('h1', {
//   title: 'meu titulo',
//   style: { color: 'red', },
// }, 'fulano')

const {
  div,
  em,
  h2,
  span,
} = createElement

function Card({ color, }: any){
  return div(
    { style: {}, }
  )
}

function App(){
  return div(
    {
      title: ' ',
      style: { backgroundColor: '#eee', },
    },
    h2('subtitle'),
    div(
      { style: { border: '1px solid red', }, },
      span('rondy '),
      em('emphasys '),
      'span',
      div('rondy')
    ),
    createElement('div', 'rondy', 'mesquita')
  )
}

document.body.appendChild(App())
