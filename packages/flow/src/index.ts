import { stopOnError } from './options'
import { Context, Option, Result, Stage, Status } from './types'
import { createObjectFromArray } from './utils'

export * from './types'
export * from './options'

export interface Flow {
  run: (options?: Option[]) => Array<Result>
  runAsync: (options?: Option[]) => Promise<Array<Result>>
  context: Map<any, any>
}

export const flow = (stages: Array<Stage>): Flow => {
  const context: Context = new Map()

  const run = (options: Option[] = [stopOnError()]): Array<Result> => {
    const results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (let index = 0; index < stages.length; index++) {
      const stage = stages[index]

      try {
        const stageResult = stage(context)
        results.push({
          status: Status.OK,
          data: stageResult,
        })
      } catch (error) {
        results.push({
          status: Status.FAIL,
          data: error,
        })

        if (optionsObject.stopOnError) {
          break
        }
      }
    }
    return results
  }

  const runAsync = async (
    options: Option[] = [stopOnError()],
  ): Promise<Array<Result>> => {
    const results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (let index = 0; index < stages.length; index++) {
      const stage = stages[index]

      try {
        const stageResult = await stage(context)
        results.push({
          status: Status.OK,
          data: stageResult,
        })
      } catch (error) {
        results.push({
          status: Status.FAIL,
          data: error,
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
