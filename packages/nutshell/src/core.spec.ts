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
    const shell = {
      exec: vi.fn().mockResolvedValueOnce({
        stderr: '',
        stdout: 'Hello\n',
      }),
    }

    const { $ } = createSut({ shell })
    await expect($('echo "Hello"')).resolves.toEqual({
      stderr: '',
      stdout: 'Hello\n',
    })

    expect(shell.exec).toHaveBeenNthCalledWith(1, 'echo "Hello"')
  })

  it('should execute a multiple line command', async () => {
    const shell = {
      exec: vi
        .fn()
        .mockResolvedValueOnce({
          stderr: '',
          stdout: 'Hello\n',
        })
        .mockResolvedValueOnce({
          stderr: '',
          stdout: 'World\n',
        }),
    }

    const { $ } = createSut({ shell, process })
    await expect(
      $`
      echo "Hello"
      echo "World"
    `,
    ).resolves.toEqual([
      { stderr: '', stdout: 'Hello\n' },
      { stderr: '', stdout: 'World\n' },
    ])

    expect(shell.exec).toHaveBeenNthCalledWith(1, 'echo "Hello"')
    expect(shell.exec).toHaveBeenNthCalledWith(2, 'echo "World"')
  })

  it('should enters into folder', async () => {
    const shell = {
      exec: vi.fn(),
    }

    const process = {
      chdir: vi.fn(),
    }

    const { cd } = createSut({ shell, process })

    expect(process.chdir).not.toHaveBeenCalled()
    cd('./src/__fixtures__')
    expect(process.chdir).toHaveBeenCalledWith('./src/__fixtures__')
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
