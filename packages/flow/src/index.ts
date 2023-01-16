import { Context, Result, Stage, Status } from './types'
export * from './types'

export const flow = (stages: Array<Stage>) => {
  const result: Array<Result> = []
  return () => {
    for (let index = 0; index < stages.length; index++) {
      const stage = stages[index]

      const contextResults = {
        interrupted: false,
      }

      const ctx: Context = {
        interrupt: function (): void {
          contextResults.interrupted = true
        },
      }

      try {
        const stageResult = stage(ctx)
        result.push({
          status: Status.OK,
          result: stageResult,
        })
        if (contextResults.interrupted) {
          console.log('interrupted')

          break
        }
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
