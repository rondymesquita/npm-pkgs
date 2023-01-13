import { Result, Stage, Status } from './types'
export * from './types'

// const stages =

export const flow = (stages: Array<Stage>) => {
  const result: Array<Result> = []
  return () => {
    for (let index = 0; index < stages.length; index++) {
      const stage = stages[index]

      try {
        const stageResult = stage()
        result.push({
          status: Status.OK,
          result: stageResult,
        })
      } catch (error) {
        result.push({
          status: Status.FAIL,
          result: (error as Error).message,
        })
        break
      }
    }
    return result
  }
}
