import { defineCore, DefineCoreInput } from './core'
import { DEFAULT_CONFIG } from './coredefaults'
import { vi, describe, it, expect } from 'vitest'
import { fillMocks } from './testutils'
import { DeepPartial } from './models'

vi.mock('./logger', () => ({
  createLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    verbose: vi.fn(),
  })),
}))

const createSut = (input: DeepPartial<DefineCoreInput>) => {
  return defineCore(fillMocks(input) as DefineCoreInput)
}

describe('core', () => {
  it('should execute a single line command', async () => {
    const mocks = {
      childProcess: {
        execAsync: vi.fn().mockResolvedValueOnce({
          stderr: '',
          stdout: 'Hello\n',
        }),
      },
    }

    const { $ } = createSut(mocks)
    await expect($('echo "Hello"')).resolves.toEqual({
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

    const { $ } = createSut(mocks)
    await expect(
      $`
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

    const { cd } = createSut(mocks)

    expect(mocks.process.chdir).not.toHaveBeenCalled()
    cd('./src/__fixtures__')
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

    const { setConfig, config } = createSut({})
    setConfig({ loggerLevel: 'none' })

    expect(DEFAULT_CONFIG).toEqual({
      loggerLevel: 'info',
      shell: 'bash',
    })

    expect(config).toEqual({
      loggerLevel: 'none',
      shell: 'bash',
    })
  })

  it('should run ls', async () => {
    const { ls } = createSut({
      process: {
        cwd: vi.fn().mockReturnValue('./src/__fixtures__'),
      },
      fs: {
        readdir: vi.fn(() => ['fake-file']),
      },
    })
    expect(ls()).resolves.toEqual(['fake-file'])
  })
})
