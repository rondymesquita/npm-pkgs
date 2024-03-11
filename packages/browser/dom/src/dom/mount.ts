import { NoRootElementError } from '../errors/errors'
import { Component } from '../models/models'

export function mount(component: Component, querySelector: string) {
  const rootElement = document.querySelector(querySelector)
  if(!rootElement) {
    console.error(new NoRootElementError(querySelector))
    return
  }
  rootElement.replaceChildren(
    component()
  )
}
