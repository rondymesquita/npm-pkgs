import { Result, Stage, Status } from './types'
export * from './types'

export const flow = (stages: Array<Stage>) => {
  const results: Array<Result> = []
  return () => {
    for (let index = 0; index < stages.length; index++) {
      const stage = stages[index]

      try {
        const stageResult = stage()
        results.push({
          status: Status.OK,
          data: stageResult,
        })
      } catch (error) {
        results.push({
          status: Status.FAIL,
          data: (error as Error).message,
        })
        break
      }
    }
    return results
  }
}
