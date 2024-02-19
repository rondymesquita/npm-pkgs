import { readFileSync, rmSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export interface Definition {
  cwd: string
  patchFile: string
  outputFile: string
  indent?: number
  // replace: {
  //   [key: string]: any
  // }
}

export const definePatcher = ({
  cwd,
  patchFile,
  outputFile,
  indent = 2,
}: Definition) => {
  const jsonPath = resolve(cwd, outputFile)
  const patchJsonPath = resolve(cwd, patchFile)
  const bkpJsonPath = resolve(cwd, `bkp-${outputFile}`)

  const patch = () => {
    const json = JSON.parse(readFileSync(jsonPath).toString())
    writeFileSync(bkpJsonPath, JSON.stringify(json, null, indent))

    const replace = JSON.parse(readFileSync(patchJsonPath).toString())
    const patchedJson = {
      ...json,
      ...replace,
    }
    writeFileSync(jsonPath, JSON.stringify(patchedJson, null, indent))
  }

  const reset = () => {
    const bkpJson = JSON.parse(readFileSync(bkpJsonPath).toString())
    writeFileSync(jsonPath, JSON.stringify(bkpJson, null, indent))
    rmSync(bkpJsonPath)
  }

  return {
    patch,
    reset,
  }
}
