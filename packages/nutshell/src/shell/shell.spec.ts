import { Volume } from 'memfs/lib/volume'
import * as Path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_OPTIONS, useGlobalOptions } from './shared'
import { defineShell } from './shell'

const createSut = ({
  childProcess = vi.fn(),
  fs = vi.fn(),
  process = vi.fn(),
  sync = vi.fn(),
}: any) => {
  return defineShell(childProcess, process, fs, sync)
}

const mocks: any = {
  process: { cwd: vi.fn(() => '/var/www'), },
  path: { resolve: Path.resolve, },
  fs: {},
}

const { options, setOptions, } = useGlobalOptions()

let mockFs;
describe('shell', () => {
  beforeEach(() => {
    mockFs && mockFs.restore()
  })
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
    const volume = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/www/file.txt',])

    const { copy, } = createSut(mocks)
    copy('/var/www/file.txt', '/var/temp/file.txt')
    expect(volume.toJSON()).toEqual({
      '/var/www/file.txt': 'fake',
      '/var/temp/file.txt': 'fake',
    })
  })

  it('copy file to dir', async() => {
    const volume = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/www/file.txt',])

    const { copy, } = createSut(mocks)
    copy('/var/www/file.txt', '/var/temp')
    expect(volume.toJSON()).toEqual({
      '/var/www/file.txt': 'fake',
      '/var/temp/file.txt': 'fake',
    })
  })
  it('copy file to relative dir', async() => {
    const volume = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/www/file.txt',])
    const { copy, } = createSut(mocks)
    copy('/var/www/file.txt', '../temp')
    expect(mocks.fs.toJSON()).toEqual({
      '/var/www/file.txt': 'fake',
      '/var/temp/file.txt': 'fake',
    })
  })
  it('copy files to dir using globs (wildcards)', async() => {

    const volume = Volume.fromNestedJSON({
      '/var/www/deep': {
        'file.txt': 'fake',
        'another.txt': 'fake',
      },
      '/var/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/www/deep/file.txt', '/var/www/deep/another.txt',])
    const { copy, } = createSut(mocks)
    copy('/var/**/*', '/var/temp')
    expect(volume.toJSON()).toEqual({
      '/var/www/deep/file.txt': 'fake',
      '/var/www/deep/another.txt': 'fake',
      '/var/temp/file.txt': 'fake',
      '/var/temp/another.txt': 'fake',
    })
  })
  it('copy files to dir using globs (wildcards)', async() => {
    const volume = Volume.fromNestedJSON({
      '/var': {
        'file.js': 'fake js',
        '/www': {
          'file.txt': 'fake',
          'another.js': 'fake js',
        },
      },
      '/var/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/file.js', '/var/www/another.js',])
    const { copy, } = createSut(mocks)
    copy('/var/**/*.js', '/var/temp')
    expect(volume.toJSON()).toEqual({
      '/var/file.js': 'fake js',
      '/var/www/file.txt': 'fake',
      '/var/www/another.js': 'fake js',
      '/var/temp/file.js': 'fake js',
      '/var/temp/another.js': 'fake js',
    })
  })
  it('move files', async() => {
    const volume = Volume.fromNestedJSON({
      '/var/www/file.txt': 'fake',
      '/var/www/another.txt': 'fake',
      '/var/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/www/file.txt', '/var/www/another.txt',])

    const { move, } = createSut(mocks)
    move('/var/**/*.txt', '/var/temp')
    expect(volume.toJSON()).toEqual({
      '/var/www': null,
      '/var/temp/file.txt': 'fake',
      '/var/temp/another.txt': 'fake',
    })
  })
  it('replicate folder structure', async() => {
    const volume = Volume.fromNestedJSON({
      '/var': {
        '/www/deep': {
          'file.txt': 'fake',
          'another.txt': 'fake',
        },
      },
      '/etc/temp': {},
    })
    mocks.fs = volume
    mocks.sync = vi.fn(() => ['/var/www/deep/file.txt', '/var/www/deep/another.txt',])

    const { replicate, } = createSut(mocks)
    replicate('/var', '/etc/temp')
    expect(volume.toJSON()).toEqual({
      '/var/www/deep/file.txt': 'fake',
      '/var/www/deep/another.txt': 'fake',
      '/etc/temp/www/deep/file.txt': 'fake',
      '/etc/temp/www/deep/another.txt': 'fake',
    })
  })
})
