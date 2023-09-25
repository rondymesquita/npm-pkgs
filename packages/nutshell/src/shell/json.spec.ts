import { Volume } from 'memfs/lib/volume'
import Path from 'path'
import { describe, expect, it, vi } from 'vitest'

import { defineFile } from './file'
import { defineJson } from './json'


const createSut = ({
  fs = vi.fn(),
  path = vi.fn(),
  process = vi.fn(),
}: any) => {
  return defineJson(defineFile(process, fs, path))
}

const mocks = {
  process: { cwd: vi.fn(() => '/var/www'), },
  path: { resolve: Path.resolve, },
  fs: {} as any,
}

describe('file', () => {
  it('write file', async() => {
    mocks.fs = Volume.fromNestedJSON({ '/var/www': {}, })
    const { json, } = createSut(mocks)

    json('fake-file.txt')
    expect(mocks.fs.toJSON()).toEqual({ '/var/www': null, })

    json('fake-file.txt').write({ alpha: 'beta', })
    expect(mocks.fs.toJSON()).toEqual({ '/var/www/fake-file.txt': '{"alpha":"beta"}', })

    json('fake-file.txt').read()
    expect(mocks.fs.toJSON()).toEqual({ '/var/www/fake-file.txt': '{"alpha":"beta"}', })
  })

  it('read file', async() => {
    mocks.fs = Volume.fromNestedJSON({ '/var/www/fake-file.txt': '{"alpha": "beta"}', })
    const { json, } = createSut(mocks)

    const content = json('fake-file.txt').read()
    expect(content).toEqual({ alpha: 'beta', })
  })

  it('touch file', async() => {
    mocks.fs = Volume.fromNestedJSON({ '/var/www': {}, })
    const { json, } = createSut(mocks)

    json('fake-file.txt').write()
    expect(mocks.fs.toJSON()).toEqual({ '/var/www/fake-file.txt': '{}', })

    const content = json('fake-file.txt').read()
    expect(content).toEqual({})
  })
})
