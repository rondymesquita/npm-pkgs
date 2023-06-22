import { vi, describe, it, expect, beforeEach } from 'vitest'
import { fillMocks } from './testutils'
import { DeepPartial } from './models'
import { defineService, DefineServiceInput } from './service'
import { Volume } from 'memfs/lib/index'
import pathActual from 'path'

const createSut = (input: DeepPartial<DefineServiceInput>) => {
  return defineService(fillMocks(input) as DefineServiceInput)
}

describe('service', () => {
  it('should start service and create logs and pid files', async () => {
    const mockFs = Volume.fromNestedJSON({
      '/var/log': {},
    })

    const mocks = {
      childProcess: {
        spawn: vi.fn().mockReturnValueOnce({
          pid: 1,
        }),
      },

      fs: mockFs,
      path: {
        resolve: pathActual.resolve,
      },
    }

    const { service } = createSut(mocks)

    expect(mockFs.toJSON()).toEqual({
      '/var/log': null,
    })
    const { start } = service({
      name: 'fake.service',
      cmd: 'fakebin fakeparam --fakearg=1',
    })

    expect(mockFs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid': null,
    })

    start()

    expect(mockFs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid/fake.service.pid': '1',
    })
  })
  it('should start service and delete pid file and keep log files', async () => {
    const mockFs = Volume.fromNestedJSON({
      '/var/log': {},
    })

    const mocks = {
      childProcess: {
        spawn: vi.fn().mockReturnValueOnce({
          pid: 1,
        }),
        execSync: vi.fn(),
      },

      fs: mockFs,
      path: {
        resolve: pathActual.resolve,
      },
    }

    const { service } = createSut(mocks)

    const { start, stop } = service({
      name: 'fake.service',
      cmd: 'fakebin fakeparam --fakearg=1',
    })

    start()
    stop()

    expect(mockFs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid': null,
    })
  })
  it('should restart service', async () => {
    const mockFs = Volume.fromNestedJSON({
      '/var/log': {},
    })

    const mocks = {
      childProcess: {
        spawn: vi.fn().mockReturnValueOnce({
          pid: 1,
        }),
        execSync: vi.fn(),
      },

      fs: mockFs,
      path: {
        resolve: pathActual.resolve,
      },
    }

    const { service } = createSut(mocks)

    const { restart } = service({
      name: 'fake.service',
      cmd: 'fakebin fakeparam --fakearg=1',
    })

    restart()

    expect(mockFs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid/fake.service.pid': '1',
    })
  })
})
