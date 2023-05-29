import { describe, it, expect } from 'vitest'
import { prepareCommand } from './utils'

describe('utils', () => {
  it('should prepare a command for running', async () => {
    expect(prepareCommand('echo 1')).toEqual('echo 1')
    expect(
      prepareCommand(`
      echo 1
    `),
    ).toEqual('echo 1')
  })
  it('should prepare a command for running from tempalte string', async () => {
    expect(
      prepareCommand`
        echo 1
        echo 2
    `,
    ).toEqual(['echo 1', 'echo 2'])
  })
})
