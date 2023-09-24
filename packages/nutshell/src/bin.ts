#!/usr/bin/env node

// import { DEFAULT_CONFIG } from '.'
import './globals'

// import { createLogger } from './logger'
// import { DEFAULT_OPTIONS } from './shell';

// const logger = createLogger(DEFAULT_OPTIONS)
;(async() => {
  const callerPath = process.cwd()
  const callerFile = process.argv[2]

  // logger.debug('bin', {
  //   callerFile,
  //   callerPath,
  // })

  await import(`${callerPath}/${callerFile}`)
})()
