import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_OPTIONS, defineShell } from '.'
import { useGlobalOptions } from './shared'

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
  process = vi.fn(),
  fs = vi.fn(),
}: any) => {
  return defineShell(childProcess, process, fs)
}

const { options, setOptions, } = useGlobalOptions()

describe('core', () => {
  it('should execute a single line command', async () => {
    const mocks = {
      childProcess: {
        exec: vi
          .fn()
          .mockImplementationOnce((a, callback) =>
            callback(null, {
              stderr: '',
              stdout: 'Hello\n',
            })),
      },
    }

    const sut = createSut(mocks)
    await expect(sut.$('echo "Hello"')).resolves.toEqual({
      stderr: '',
      stdout: 'Hello\n',
    })

    expect(mocks.childProcess.exec).toHaveBeenNthCalledWith(1,
      'echo "Hello"',
      expect.any(Function))
  })

  it('should execute a multiple line command', async () => {
    const mocks = {
      childProcess: {
        exec: vi
          .fn()
          .mockImplementationOnce((a, callback) =>
            callback(null, {
              stderr: '',
              stdout: 'Hello\n',
            }))
          .mockImplementationOnce((a, callback) =>
            callback(null, {
              stderr: '',
              stdout: 'World\n',
            })),
      },
      process,
    }

    const sut = createSut(mocks)
    await expect(sut.$`
      echo "Hello"
      echo "World"
    `).resolves.toEqual([
      {
        stderr: '',
        stdout: 'Hello\n',
      },
      {
        stderr: '',
        stdout: 'World\n',
      },
    ])

    expect(mocks.childProcess.exec).toHaveBeenNthCalledWith(1,
      'echo "Hello"',
      expect.any(Function))
    expect(mocks.childProcess.exec).toHaveBeenNthCalledWith(2,
      'echo "World"',
      expect.any(Function))
  })

  it('should enters into folder', async () => {
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

  it('should run ls', async () => {
    const sut = createSut({
      process: { cwd: vi.fn().mockReturnValue('./src/__fixtures__'), },
      fs: { readdirSync: vi.fn().mockReturnValue(['fake-file',]), },
    })
    expect(sut.ls()).toEqual(['fake-file',])
  })
})
