import { describe, it, expect, vi, Mock } from 'vitest'
import { defineCore } from './core'
import { IFS, IPath, Path } from './infra'
import path from 'path'

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

    const { defineDotenv } = defineCore({
      fs: fsMock,
      path: pathMock,
    })

    const { parseDotenv } = defineDotenv()
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

    const { defineDotenv } = defineCore({
      path: pathMock,
      fs: (fsMock as unknown) as IFS,
    })

    const { parseDotenv } = defineDotenv()
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

    const { defineDotenv } = defineCore({
      path: pathMock,
      fs: (fsMock as unknown) as IFS,
    })

    const { parseDotenv } = defineDotenv({
      filename: '.env-development',
    })
    parseDotenv()

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

    const { defineDotenv } = defineCore({
      path: pathMock,
      fs: (fsMock as unknown) as IFS,
    })

    const { parseDotenv } = defineDotenv({
      cwd: 'fake-folder-path',
    })
    parseDotenv()

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
})
