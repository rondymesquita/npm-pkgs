import { DEFAULT_CONFIG } from './coredefaults'
import { vi, describe, it, expect, Mock, Mocked, MockedClass } from 'vitest'
import { DeepPartial } from './models'
import { Core } from './core'
import { exportClassMembers } from './utils'
import * as ChildProcess from 'child_process'
import Process from 'process'
import * as FS from 'fs'

import { ChildProcessExtended } from './child-process-extended'

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
}: {
  childProcess?: Partial<ChildProcessExtended> | Mock
  process?: Partial<typeof Process> | Mock
  fs?: Partial<typeof FS> | Mock
}) => {
  class Sut extends Core {
    constructor() {
      super(childProcess as any, process as any, fs as any)
    }
  }

  return new Sut()
}

describe('core', () => {
  it('should execute a single line command', async () => {
    const mocks = {
      childProcess: {
        execAsync: vi
          .fn()
          .mockResolvedValueOnce({ stderr: '', stdout: 'Hello\n' }),
      },
    }

    const sut = createSut(mocks)
    await expect(sut.$('echo "Hello"')).resolves.toEqual({
      stderr: '',
      stdout: 'Hello\n',
    })

    expect(mocks.childProcess.execAsync).toHaveBeenNthCalledWith(
      1,
      'echo "Hello"',
    )
  })

  it('should execute a multiple line command', async () => {
    const mocks = {
      childProcess: {
        execAsync: vi
          .fn()
          .mockResolvedValueOnce({
            stderr: '',
            stdout: 'Hello\n',
          })
          .mockResolvedValueOnce({
            stderr: '',
            stdout: 'World\n',
          }),
      },
      process,
    }

    const sut = createSut(mocks)
    await expect(
      sut.$`
      echo "Hello"
      echo "World"
    `,
    ).resolves.toEqual([
      { stderr: '', stdout: 'Hello\n' },
      { stderr: '', stdout: 'World\n' },
    ])

    expect(mocks.childProcess.execAsync).toHaveBeenNthCalledWith(
      1,
      'echo "Hello"',
    )
    expect(mocks.childProcess.execAsync).toHaveBeenNthCalledWith(
      2,
      'echo "World"',
    )
  })

  it('should enters into folder', async () => {
    const mocks = {
      childProcess: {
        exec: vi.fn(),
      },
      process: {
        chdir: vi.fn(),
      },
    }

    const sut = createSut(mocks)

    expect(mocks.process.chdir).not.toHaveBeenCalled()
    sut.cd('./src/__fixtures__')
    expect(mocks.process.chdir).toHaveBeenCalledWith('./src/__fixtures__')
  })

  it('should have default configuration', () => {
    expect(DEFAULT_CONFIG).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })
  })

  it('should set configuration', () => {
    expect(DEFAULT_CONFIG).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })

    const sut = createSut({})
    sut.setConfig({ loggerLevel: 'none' })

    expect(DEFAULT_CONFIG).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })

    expect(sut.config).toEqual({
      loggerLevel: 'none',
      shell: 'bash',
    })
  })

  it.only('should run ls', async () => {
    const sut = createSut({
      process: {
        cwd: vi.fn().mockReturnValue('./src/__fixtures__'),
      },
      fs: {
        readdirSync: vi.fn().mockResolvedValue(['fake-file']),
      },
    })
    expect(sut.ls()).resolves.toEqual(['fake-file'])
  })
})
