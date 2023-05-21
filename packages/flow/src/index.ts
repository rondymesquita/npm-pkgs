import { isPromise } from 'util/types'
import { stopOnError } from './options'
import { Context, Option, ProvideArgsFn, Result, Stage, Status } from './types'
import { createObjectFromArray, processResultPromise } from './utils'

export * from './types'
export * from './options'

export interface Flow {
  run: (options?: Option[]) => Array<Result>
  runAsync: (options?: Option[]) => Promise<Array<Result>>
  context: Map<any, any>
  provideArgs: (fn: (ctx: Context) => Array<any>) => void
  setStages: (stages: Array<Stage>) => void
}

export const flow = (stages: Array<Stage> = []): Flow => {
  let provideArgsFn: ProvideArgsFn | null = null
  const state: {
    context: Context
    stages: Array<Stage>
  } = {
    context: new Map(),
    stages,
  }

  const runStage = (stage: Stage): Result => {
    try {
      const args = provideArgsFn
        ? provideArgsFn!(state.context)
        : [state.context]
      const stageResult = stage(...args)
      return {
        data: stageResult,
        status: Status.OK,
      }
    } catch (err) {
      return {
        data: err,
        status: Status.FAIL,
      }
    }
  }

  const setStages = (stages: Array<Stage>) => {
    state.stages = stages
  }

  const provideArgs = (fn: ProvideArgsFn) => {
    provideArgsFn = fn
  }

  const runAsync = async (
    options: Option[] = [stopOnError()],
  ): Promise<Array<Result>> => {
    let results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (const stage of state.stages) {
      let result = runStage(stage)
      result = await processResultPromise(result)
      results.push(result)
      if (result.status === Status.FAIL && optionsObject.stopOnError) {
        break
      }
    }
    return results
  }

  const run = (options: Option[] = [stopOnError()]): Array<Result> => {
    let results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (const stage of state.stages) {
      const result = runStage(stage)
      results.push(result)
      if (result.status === Status.FAIL && optionsObject.stopOnError) {
        break
      }
    }
    return results
  }

  return { run, runAsync, context: state.context, provideArgs, setStages }
}
