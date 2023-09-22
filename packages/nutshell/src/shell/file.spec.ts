import { memfs } from 'memfs/lib/index'
import Path from 'path'
import { describe, expect, it, vi } from 'vitest'

import { defineFile } from './file'

vi.mock('./logger', () => ({
  createLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    verbose: vi.fn(),
  })),
}))

const createSut = ({
  fs = vi.fn(),
  path = vi.fn(),
  process = vi.fn(),
}: any) => {
  return defineFile(process, fs, path)
}

const mocks = {
  process: { cwd: vi.fn(() => '/var/www'), },
  path: { resolve: Path.resolve, },
  fs: {} as any,
}

describe('file', () => {
  it('write file', async() => {
    mocks.fs = memfs({ '/var/www': {}, }).vol
    const { file, } = createSut(mocks)

    file('fake-file.txt')
    expect(mocks.fs.toJSON()).toEqual({ '/var/www': null, })

    file('fake-file.txt').content('not a content yet')
    expect(mocks.fs.toJSON()).toEqual({ '/var/www': null, })

    file('fake-file.txt').content('fake-content').write()
    expect(mocks.fs.toJSON()).toEqual({ '/var/www/fake-file.txt': 'fake-content', })
  })

  it('read file', async() => {
    mocks.fs = memfs({ '/var/www/fake-file.txt': 'fake file content', }).vol
    const { file, } = createSut(mocks)

    const content = file('fake-file.txt').read()
    expect(content).toEqual('fake file content')
  })

  it('touch file', async() => {
    mocks.fs = memfs({ '/var/www': {}, }).vol
    const { file, } = createSut(mocks)

    file('fake-file.txt').write()
    expect(mocks.fs.toJSON()).toEqual({ '/var/www/fake-file.txt': '', })

    const content = file('fake-file.txt').read()
    expect(content).toEqual('')
  })

  it('replace file content', async() => {
    mocks.fs = memfs({ '/var/www/fake-file.txt': 'The lightsaber is blue', }).vol
    const { file, } = createSut(mocks)

    file('fake-file.txt').replace('blue', 'red')
    expect(mocks.fs.toJSON()).toEqual({ '/var/www/fake-file.txt': 'The lightsaber is red', })
  })
})
