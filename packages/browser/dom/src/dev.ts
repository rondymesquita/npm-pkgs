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

const app = div(
  h2('subtitle'),
  span(),
  span(
    { style: { border: '1px solid red', }, },
    span('rondy '),
    em('emphasys '),
    'asd'
  ),
  createElement('div', 'rondy', 'mesquita')
)
document.body.appendChild(app)
