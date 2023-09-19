import { log } from 'console'
import { Volume } from 'memfs/lib/index'
import { Volume } from 'memfs/lib/volume'
import * as Path from 'path'
import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_OPTIONS, useGlobalOptions } from './shared'
import { defineShell } from './shell'

vi.mock('./logger', () => ({
  createLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    verbose: vi.fn(),
  })),
}))

const createSut = ({
  childProcess = vi.fn(),
  fs = vi.fn(),
  process = vi.fn(),
}: any) => {
  log(typeof fs)
  return defineShell(childProcess, process, fs)
}

const mocks: any = {
  process: { cwd: vi.fn(() => '/var/www'), },
  path: { resolve: Path.resolve, },
  fs: {},
}


const { options, setOptions, } = useGlobalOptions()

describe('shell', () => {
  it('should execute a single line command', async() => {
    const mocks = {
      childProcess: {
        execSync: vi
          .fn()
          .mockImplementationOnce(() => 'Hello\n'),
      },
    }

    const sut = createSut(mocks)
    expect(sut.run('echo "Hello"')).toEqual(
      'Hello\n'
    )

    expect(mocks.childProcess.execSync).toHaveBeenNthCalledWith(1, 'echo "Hello"')

  })

  it('should execute a multiple line command', async() => {
    const mocks = {
      childProcess: {
        execSync: vi
          .fn()
          .mockImplementationOnce(() => 'Hello\n')
          .mockImplementationOnce(() => 'World\n'),
      },
      process,
    }

    const sut = createSut(mocks)
    expect(sut.run`
      echo "Hello"
      echo "World"
    `).toEqual([
      'Hello\n',
      'World\n',
    ])

    expect(mocks.childProcess.execSync).toHaveBeenNthCalledWith(1,
      'echo "Hello"')
    expect(mocks.childProcess.execSync).toHaveBeenNthCalledWith(2,
      'echo "World"')
  })

  it('should enters into folder', async() => {
    const mocks = {
      childProcess: { exec: vi.fn(), },
      process: { chdir: vi.fn(), },
    }

    const sut = createSut(mocks)

    expect(mocks.process.chdir).not.toHaveBeenCalled()
    sut.cd('./src/__fixtures__')
    expect(mocks.process.chdir).toHaveBeenCalledWith('./src/__fixtures__')
  })

  it('should have default configuration', () => {
    expect(DEFAULT_OPTIONS).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })
  })

  it('should set configuration', () => {
    expect(DEFAULT_OPTIONS).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })

    // const sut = createSut({})
    setOptions({ loggerLevel: 'none', })

    expect(DEFAULT_OPTIONS).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })

    expect(options).toEqual({
      loggerLevel: 'none',
      shell: 'bash',
    })
  })

  it('should run ls', async() => {
    const sut = createSut({
      process: { cwd: vi.fn().mockReturnValue('./src/__fixtures__'), },
      fs: { readdirSync: vi.fn().mockReturnValue(['fake-file',]), },
    })
    expect(sut.ls()).toEqual(['fake-file',])
  })
  it('copy file to file', async() => {
    mocks.fs = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    const { copy, } = createSut(mocks)
    // copy('/var/www/file.txt', '/var/temp/file.txt')
    // copy('/var/www/file.txt', '/var/temp')
  })
  it.only('copy file to file', async() => {
    mocks.fs = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    const { copy, } = createSut(mocks)
    copy('/var/www/file.txt', '/var/temp/file.txt')
    expect(mocks.fs.toJSON()).toEqual({
      '/var/www/file.txt': 'fake',
      '/var/temp/file.txt': 'fake',
    })
  })
  it.only('copy file to dir', async() => {
    mocks.fs = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    const { copy, } = createSut(mocks)
    copy('/var/www/file.txt', '/var/temp')
    expect(mocks.fs.toJSON()).toEqual({
      '/var/www/file.txt': 'fake',
      '/var/temp/file.txt': 'fake',
    })
  })
  it.only('copy file to relative dir', async() => {
    mocks.fs = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    const { copy, } = createSut(mocks)
    copy('/var/www/file.txt', '../temp')
    expect(mocks.fs.toJSON()).toEqual({
      '/var/www/file.txt': 'fake',
      '/var/temp/file.txt': 'fake',
    })
  })
})
