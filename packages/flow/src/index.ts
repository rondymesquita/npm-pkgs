import { stopOnError } from './options'
import { Context, Option, ProvideArgsFn, Result, Stage, Status } from './types'
import { createObjectFromArray } from './utils'

export * from './types'
export * from './options'

export interface Flow {
  run: (options?: Option[]) => Array<Result>
  runAsync: (options?: Option[]) => Promise<Array<Result>>
  context: Map<any, any>
  provideArgs: (fn: (ctx: Context) => Array<any>) => void
  setStages: (stages: Array<Stage>) => void
}

interface FlowState {
  context: Context
  stages: Array<Stage>
  provideArgsFn: ProvideArgsFn | null
}

export const flow = (stages: Array<Stage> = []): Flow => {
  const state: FlowState = {
    context: new Map(),
    stages,
    provideArgsFn: null,
  }

  const runStage = (stage: Stage): Result | Promise<Result> => {
    try {
      const args = state.provideArgsFn
        ? state.provideArgsFn!(state.context)
        : [state.context]
      const stageResult = stage(...args)

      if (stageResult instanceof Promise) {
        return new Promise((resolve) => {
          stageResult
            .then((data: any) => {
              resolve({ data, status: Status.OK })
            })
            .catch((err: any) => {
              resolve({ data: err, status: Status.FAIL })
            })
        })
      }

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
    state.provideArgsFn = fn
  }

  const runAsync = async (
    options: Option[] = [stopOnError()],
  ): Promise<Array<Result>> => {
    let results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    for (const stage of state.stages) {
      let result = await runStage(stage)
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
      const result = runStage(stage) as Result
      results.push(result)
      if (result.status === Status.FAIL && optionsObject.stopOnError) {
        break
      }
    }
    return results
  }

  return { run, runAsync, context: state.context, provideArgs, setStages }
}
