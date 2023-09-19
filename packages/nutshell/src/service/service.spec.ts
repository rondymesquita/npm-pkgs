import { Volume } from 'memfs/lib/index'
import pathActual from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { defineService } from './service'

const createSut = ({
  childProcess = vi.fn(),
  fs = vi.fn(),
  path = vi.fn(),
  process = vi.fn(),
}: any) => {
  return defineService(childProcess, path, fs, process)
}
const unref = vi.fn()
const mocks: any = {
  childProcess: {
    spawn: vi.fn(() => ({
      pid: 1,
      unref,
    })),
  },

  fs: undefined,
  path: { resolve: pathActual.resolve, },
  process: { cwd: vi.fn(() => '/current-work-dir'), },
}

describe.skip('service', () => {
  beforeEach(() => {
    mocks.fs = Volume.fromNestedJSON({ '/var/log': {}, })
  })
  it('should have default configurations when some option are not informed', async () => {
    const options = {
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
    }
    const service = createSut(mocks)
    const myservice = service(options)

    expect(mocks.fs.toJSON()).toEqual({
      '/current-work-dir/fake.service-err.log': '',
      '/current-work-dir/fake.service.log': '',
      '/var/log': null,
    })

    myservice.start()

    expect(mocks.fs.toJSON()).toEqual({
      '/current-work-dir/fake.service-err.log': '',
      '/current-work-dir/fake.service.log': '',
      '/current-work-dir/fake.service.pid': '1',
      '/var/log': null,
    })
  })
  it('should start service and create logs and pid files', async () => {
    mocks.childProcess.execSync = vi.fn()
    const options = {
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    }
    const service = createSut(mocks)
    const myservice = service(options)

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid': null,
    })

    expect(unref).not.toHaveBeenCalled()
    myservice.start()

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid/fake.service.pid': '1',
    })

    expect(unref).toHaveBeenCalled()
  })
  it('should start service and delete pid file and keep log files', async () => {
    const options = {
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    }
    const service = createSut(mocks)
    const myservice = service(options)

    myservice.start()
    myservice.stop()

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid': null,
    })
  })
  it('should restart service', async () => {
    const options = {
      name: 'fake.service',
      command: 'fakebin fakeparam --fakearg=1',
      cwdLog: '/var/log',
      cwdPid: '/var/pid',
    }
    const service = createSut(mocks)
    const myservice = service(options)

    myservice.restart()

    expect(mocks.fs.toJSON()).toEqual({
      '/var/log/fake.service-err.log': '',
      '/var/log/fake.service.log': '',
      '/var/pid/fake.service.pid': '1',
    })
  })
})
