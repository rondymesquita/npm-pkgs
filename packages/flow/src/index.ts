import { stopOnError } from './options'
import {
  Context,
  Option,
  ProvideArgsFn,
  Result,
  Task,
  StageMap,
  StageObject,
  Stages,
  Status,
} from './types'
import { createObjectFromArray } from './utils'

export * from './types'
export * from './options'

export interface Flow {
  run: (options?: Option[]) => Array<Result>
  runAsync: (options?: Option[]) => Promise<Array<Result>>
  context: Map<any, any>
  provideArgs: (fn: (ctx: Context) => Array<any>) => void
  setStages: (stages: Stages) => void
}

interface FlowState {
  context: Context
  stages: StageObject
  provideArgsFn: ProvideArgsFn | null
}

const parseStages = (stages: Stages): StageObject => {
  let stagesObject = {}
  if (Array.isArray(stages)) {
    stagesObject = Object.fromEntries(
      stages.map((stage, index) => {
        return [String(index), stage]
      }),
    )
  } else if (stages instanceof Map) {
    stagesObject = Object.fromEntries(Array.from(stages))
  } else {
    stagesObject = stages
  }

  return stagesObject
}

export const flow = (stages: Stages = []): Flow => {
  const state: FlowState = {
    context: new Map(),
    stages: parseStages(stages),
    provideArgsFn: null,
  }

  const runStage = (name: string, stage: Task): Result | Promise<Result> => {
    try {
      const args = state.provideArgsFn
        ? state.provideArgsFn!(state.context)
        : [state.context]
      const stageResult = stage(...args)

      if (stageResult instanceof Promise) {
        return new Promise((resolve) => {
          stageResult
            .then((data: any) => {
              resolve({ name, data, status: Status.OK })
            })
            .catch((err: any) => {
              resolve({ name, data: err, status: Status.FAIL })
            })
        })
      }

      return {
        name,
        data: stageResult,
        status: Status.OK,
      }
    } catch (err) {
      return {
        name,
        data: err,
        status: Status.FAIL,
      }
    }
  }

  const setStages = (stages: Stages) => {
    state.stages = parseStages(stages)
  }

  const provideArgs = (fn: ProvideArgsFn) => {
    state.provideArgsFn = fn
  }

  const runAsync = async (
    options: Option[] = [stopOnError()],
  ): Promise<Array<Result>> => {
    let results: Array<Result> = []
    const optionsObject = createObjectFromArray(options)

    const stages = parseStages(state.stages)
    for (const name in stages) {
      let result = await runStage(name, stages[name])
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

    const stages = parseStages(state.stages)
    for (const name in stages) {
      let result = runStage(name, stages[name]) as Result
      results.push(result)
      if (result.status === Status.FAIL && optionsObject.stopOnError) {
        break
      }
    }
    return results
  }

  return { run, runAsync, context: state.context, provideArgs, setStages }
}
