import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ServiceAPI } from './service'
import { Volume } from 'memfs/lib/index'
import pathActual from 'path'
import { mock } from 'node:test'

const createSut = ({
  childProcess = vi.fn(),
  path = vi.fn(),
  fs = vi.fn(),
  process = vi.fn(),
}: any) => {
  class Sut extends ServiceAPI {
    constructor() {
      super(childProcess as any, path as any, fs as any, process as any)
    }
  }

  return new Sut()
}

const mocks: any = {
  childProcess: {
    spawn: vi.fn(() => ({
      pid: 1,
    })),
  },

  fs: undefined,
  path: {
    resolve: pathActual.resolve,
  },
  process: {
    cwd: vi.fn(() => '/current-work-dir'),
  },
}

describe('service', () => {
  beforeEach(() => {
    mocks.fs = Volume.fromNestedJSON({
      '/var/log': {},
    })
  })
  it('should have default configurations when some option are not informed', async () => {
    const service = createSut(mocks)

    service.init({
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
    })

    expect(mocks.fs.toJSON()).toEqual({
      '/current-work-dir/fake.service-err.log': '',
      '/current-work-dir/fake.service.log': '',
      '/var/log': null,
    })

    service.start()

    expect(mocks.fs.toJSON()).toEqual({
      '/current-work-dir/fake.service-err.log': '',
      '/current-work-dir/fake.service.log': '',
      '/current-work-dir/fake.service.pid': '1',
      '/var/log': null,
    })
  })
  it('should start service and create logs and pid files', async () => {
    mocks.childProcess.execSync = vi.fn()
    const service = createSut(mocks)

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log': null,
    })
    service.init({
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    })

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid': null,
    })

    service.start()

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid/fake.service.pid': '1',
    })
  })
  it('should start service and delete pid file and keep log files', async () => {
    const service = createSut(mocks)

    service.init({
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    })

    service.start()
    service.stop()

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid': null,
    })
  })
  it('should restart service', async () => {
    const service = createSut(mocks)

    service.init({
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    })

    service.restart()

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid/fake.service.pid': '1',
    })
  })
})
