import { describe, it, expect, vi, Mock } from 'vitest'
import { CoreFactory } from './core'
import { IFS, IPath, Path } from './infra'
import path from 'path'
import { z } from 'zod'

describe('core', () => {
  it('should read env to variable', () => {
    const fsMock: IFS = {
      readFileSync: vi.fn(() =>
        Buffer.from(`ALPHA=1
      BETA="2"
      GAMMA=true
      DELTA="false"
      EPS=1,2,3
      ZETA=0
      ETA=`),
      ),
    }

    const pathMock: IPath = {
      resolve: vi.fn(),
    }

    const { parseDotenv } = CoreFactory({ fs: fsMock, path: pathMock })

    const env = parseDotenv()
    expect(env).toEqual({
      ALPHA: 1,
      BETA: 2,
      DELTA: false,
      EPS: '1,2,3',
      GAMMA: true,
      ZETA: 0,
    })
  })

  it('should have defaults', () => {
    const pathMock: any = {
      resolve: vi.fn(() => 'fake-folder-path'),
    }

    const fsMock: IFS = {
      readFileSync: vi.fn(() => Buffer.from('')),
    }

    const { parseDotenv } = CoreFactory({ fs: fsMock, path: pathMock })

    parseDotenv()

    expect(pathMock.resolve).toHaveBeenCalledOnce()
    expect(pathMock.resolve.mock.lastCall).toMatchObject([
      expect.any(String),
      '.env',
    ])
    expect(fsMock.readFileSync).toHaveBeenCalledOnce()
    expect(fsMock.readFileSync).toHaveBeenCalledWith('fake-folder-path')
  })
  it('should inform custom .env file', () => {
    const pathMock: any = {
      resolve: vi.fn(() => 'fake-folder-path'),
    }

    const fsMock: IFS = {
      readFileSync: vi.fn(() => Buffer.from('')),
    }

    const { parseDotenv } = CoreFactory({
      fs: fsMock,
      path: pathMock,
    })

    parseDotenv({
      filename: '.env-development',
    })

    expect(pathMock.resolve).toHaveBeenCalledOnce()
    expect(pathMock.resolve.mock.lastCall).toMatchObject([
      expect.any(String),
      '.env-development',
    ])
    expect(fsMock.readFileSync).toHaveBeenCalledOnce()
    expect(fsMock.readFileSync).toHaveBeenCalledWith('fake-folder-path')
  })
  it('should inform custom directory', () => {
    const pathMock: any = {
      resolve: vi.fn((...args) => Path.resolve(...args)),
    }

    const fsMock: IFS = {
      readFileSync: vi.fn(() => Buffer.from('')),
    }

    const { parseDotenv } = CoreFactory({
      fs: fsMock,
      path: pathMock,
    })

    parseDotenv({
      cwd: 'fake-folder-path',
    })

    expect(pathMock.resolve).toHaveBeenCalledOnce()
    expect(pathMock.resolve.mock.lastCall).toMatchObject([
      'fake-folder-path',
      '.env',
    ])
    expect(fsMock.readFileSync).toHaveBeenCalledOnce()
    expect(fsMock.readFileSync).toHaveBeenCalledWith(
      path.resolve('fake-folder-path', '.env'),
    )
  })

  it('should parse zod schema', () => {
    const fsMock: IFS = {
      readFileSync: vi.fn(() =>
        Buffer.from(`ALPHA=1
      BETA="value"
      GAMMA=true
      ETA=`),
      ),
    }

    const pathMock: IPath = {
      resolve: vi.fn(),
    }

    const { parseDotenv } = CoreFactory({ fs: fsMock, path: pathMock })

    const env = parseDotenv({
      schema: z.object({
        ALPHA: z.number(),
        BETA: z.string(),
        GAMMA: z.boolean(),
        ETA: z.undefined(),
      }),
    })
    expect(env).toEqual({
      ALPHA: 1,
      BETA: 'value',
      GAMMA: true,
    })
  })
  it('should throw when parse zod schema fails', () => {
    const fsMock: IFS = {
      readFileSync: vi.fn(() =>
        Buffer.from(
          `ALPHA=1
      BETA="value"
      GAMMA=true
      ETA=`,
        ),
      ),
    }

    const pathMock: IPath = {
      resolve: vi.fn(),
    }

    const { parseDotenv } = CoreFactory({ fs: fsMock, path: pathMock })

    expect(() =>
      parseDotenv({
        schema: z.object({
          ALPHA: z.number(),
          BETA: z.boolean(),
          GAMMA: z.boolean(),
          ETA: z.undefined(),
        }),
      }),
    ).toThrowError()
  })
})
