import { describe, expect, it } from 'vitest'
import { API } from './api'
describe('api', () => {
  it('create new api', () => {
    const api = new API()
    api.tasks()
  })
})
