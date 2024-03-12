export interface Subscriber {

}
export type EventHandler = (...args: any[]) => void
export function defineEventBus<T extends string>(){
  const subscribers: Map<string, EventHandler[]> = new Map()

  return {
    on(event: T, handler: EventHandler){
      if (!subscribers.get(event)){
        subscribers.set(event, [handler,])
      } else {
        subscribers.set(event, [...subscribers.get(event)!, handler,])
      }
    },
    off(){

    },
    emit(event: T, ...data: any[]){
      const handlers = subscribers.get(event)
      if (Array.isArray(handlers)) {
        handlers.forEach((handler: EventHandler) => {
          handler(...data)
        })
      }
    },
  }
}
