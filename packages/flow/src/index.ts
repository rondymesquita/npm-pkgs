import { isPromise } from 'util/types'
import { stopOnError } from './options'
import { Context, Option, Result, Stage, Status } from './types'
import { createObjectFromArray, processResult } from './utils'

export * from './types'
export * from './options'

export interface Flow {
  run: (options?: Option[]) => Array<Result>
  runAsync: (options?: Option[]) => Promise<Array<Result>>
  context: Map<any, any>
}

export const flow = (stages: Array<Stage>): Flow => {
  const context: Context = new Map()

  const runAsync = async (
    options: Option[] = [stopOnError()],
  ): Promise<Array<Result>> => {
    let results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (const stage of stages) {
      const results = flow([stage]).run(options)
      const stageResult = await processResult(results[0])
      if (stageResult.status === Status.FAIL && optionsObject.stopOnError) {
        break
      }
    }
    return results
  }
  const run = (options: Option[] = [stopOnError()]): Array<Result> => {
    let results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (const stage of stages) {
      try {
        const stageResult = stage(context)
        results.push({
          data: stageResult,
          status: Status.OK,
        })
      } catch (err) {
        results.push({
          data: err,
          status: Status.FAIL,
        })
        if (optionsObject.stopOnError) {
          break
        }
      }
    }
    return results
  }

  return { run, runAsync, context }
}
